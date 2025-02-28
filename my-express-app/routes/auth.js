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
  const getQuery = `SELECT * FROM auth WHERE username = ?`;
  const postQuery = `INSERT INTO auth (username, password) VALUES (?, ?)`;
  try {
    const duplicate = await connectDB
      .promise()
      .execute(getQuery, [username]);
    console.log(duplicate);
    if (duplicate[0].length > 0) {
      res.send({
        message:
          "the username is already in use, select a different username!",
      });
    } else {
      const hash = await bcrypt.hash(
        password,
        saltRounds
      );

      await connectDB
        .promise()
        .execute(postQuery, [username, hash]);

      res.send({
        message:
          "Registration successful - please sign in to use Fork It!",
      });
    }
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
