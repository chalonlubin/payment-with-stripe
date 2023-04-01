"use strict";

/** User model for mongodb */

const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    stripeCustomerId: String,
  })
);

module.exports = User;
