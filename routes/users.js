"use strict";

/** Routes for users. */

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createToken } = require("../helpers/token");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/auth");
const bcrypt = require("bcrypt");

/** Temp route to get all users */
router.get("/", async (rec, res) => {
  const users = await User.find();
  return res.json(users);
});

/** Logs in user and returns JWT if username and password are correct */
router.post("/login", authenticateJWT, async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = createToken(user);

  res.json({ message: "Logged in successfully", token });
});

/** Registers new user in db, with stripe, and returns a JWT */
router.post("/register", async (req, res) => {
  const { username, email, password, role, hasTrial, endDate } = req.body;

  const emailCheck = await User.findOne({ email });
  const usernameCheck = await User.findOne({ username });
  if (emailCheck) {
    return res.status(400).json({ message: `${email} is already in use` });
  }
  if (usernameCheck) {
    return res.status(400).json({ message: `${username} is already in use` });
  }

  try {
    let hashedPass = await bcrypt.hash(password, 1);

    // register user with Stripe, need to modularize this later.
    const stripeUser = await stripe.accounts.create({
      email,
      type: "standard",
    });

    // register with mongoDB using Stripe billingID
    const newUser = new User({
      username,
      password: hashedPass,
      email,
      role,
      billingID: stripeUser.id,
      hasTrial,
      endDate,
    });

    await newUser.save();
    const token = createToken(newUser);
    return res.status(200).json({ message: "Register successful", token });
  } catch (e) {
    if (e.type === "StripeInvalidRequestError") {
      return res.status(400).json({ message: "Stripe error: " + e.message });
    }
    return res
      .status(400)
      .json({ message: "Failed registration, please try again later", e });
  }
});

module.exports = router;
