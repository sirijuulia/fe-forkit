const express = require("express");
const router = express.Router();
const connectDB = require("../model/database"); // Importa la conexión
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const supersecret = process.env.SUPER_SECRET;

module.exports = router;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(
      password,
      saltRounds
    );
    const query = `INSERT INTO auth (username, password) VALUES (?, ?)`;
    await connectDB
      .promise()
      .execute(query, [username, hash]);

    res.send({
      message: "Registration successful",
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = `SELECT * FROM auth WHERE username = ?`;
    const results = await connectDB
      .promise()
      .execute(query, [username]);
    console.log(results);
    const user = results[0][0];
    if (user) {
      const user_id = user.userID;
      const correctPassword =
        await bcrypt.compare(
          password,
          user.password
        );
      if (!correctPassword)
        throw new Error("Incorrect password");
      const token = jwt.sign(
        { user_id },
        supersecret,
        { expiresIn: "1h" }
      );
      res.send({
        message:
          "Login successful, here is your token",
        token,
        user_id,
      });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res
      .status(400)
      .send({ message: err.message });
  }
});
