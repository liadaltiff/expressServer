require("dotenv").config();

const express = require("express"); //require express
const cors = require("cors");
const app = express(); //app variable which calles express function and creates the main application
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");

mongoose.connect(process.env.DATABASE_URL);
app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.listen(5000, () => console.log("server started on port 5000"));
