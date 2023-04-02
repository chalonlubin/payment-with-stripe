"use strict";

/** Routes for users. */

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const bcrypt = require("bcrypt");

/** Logs in user */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  res.json({ message: "Logged in successfully", user });
});

/** Registers new user in db*/
router.post("/register", async (req, res) => {
  const { username, email, password, role, billingID, hasTrial, endDate } =
    req.body;

  const emailCheck = await User.findOne({ email });
  const usernameCheck = await User.findOne({ username });
  if (emailCheck) {
    return res.status(400).json({ message: `${email} is already in use` });
  }
  if (usernameCheck) {
    return res.status(400).json({ message: `${username} is already in use` });
  }

  try {
    const hashedPass = await bcrypt.hash(password, 1);
    // register user with Stripe, need to modularize this later.
    const stripeUser = await stripe.customers.create({
      email,
      name: username,
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
    return res
      .status(200)
      .json({ message: "Register successful", newUser, stripeUser });
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
