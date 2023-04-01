"use strict";

/** User model for mongodb */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  type: String,
  stripeCustomerId: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;


