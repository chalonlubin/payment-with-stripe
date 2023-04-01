"use strict";

/** Routes for users. */

const express = require("express");
const router = express.Router();
const User = require("../models/User");

/** Logs in user */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("request body - ", req.body);

  const user = await User.findOne({ username: username });
  console.log("user - ", user);

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  res.json({ message: "Logged in successfully", user });
});

/** Registers new user */
router.post("/register", async (req, res) => {
  const { username, email, password, role, stripeCustomerId } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: `${email} is already in use` });
  }

  try {
    const newUser = new User({
      username,
      password,
      email,
      role,
      stripeCustomerId,
    });
    await newUser.save();
    return res.json({ message: "Register successful", newUser });
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Failed registration, please try again later" });
  }
});

module.exports = router;
