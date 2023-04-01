"use strict";

/** User model for mongodb */

const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      default: "none",
    },
    billingID: String,
    hasTrial: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      default: null,
    },
  })
);

module.exports = User;
