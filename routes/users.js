const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

// Getting All
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// Creating One
router.post("/", async (req, res) => {
  const {
    body: { firstName, lastName, email, userName, password, favColor },
  } = req;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    firstName,
    lastName,
    email,
    userName,
    favColor,
    password: hashedPassword,
    role: "Default",
  });

  const foundUser = await User.findOne({
    $or: [{ userName: user.userName }, { email: user.email }],
  });

  //{ userName: user.userName }

  try {
    if (foundUser === null) {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } else {
      res.status(409).send("This account already exist");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName: userName });
    if (user) {
      //console.log(user, password);
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).send(user);
      } else {
        res.status(401).send("Username Or Password Are Incorrect");
      }
    } else {
      res.status(401).send("This User Does Not Exist");
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

// Updating One
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.userName = req.body.userName;
  }

  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  //console.log("given id", req.params.id);
  let user;
  try {
    user = await User.findById(req.params.id);
    //console.log("user", user);
    if (user === null) {
      return res.status(404).json({ message: "Cannot Find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  //console.log(res.user);
  next();
}

module.exports = router;
