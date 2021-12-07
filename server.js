require("dotenv").config();

const express = require("express"); //require express
const cors = require("cors");
const app = express(); //app variable which calles express function and creates the main application
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.listen(5000, () => console.log("server started on port 5000"));
