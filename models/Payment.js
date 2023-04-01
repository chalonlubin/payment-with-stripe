"use strict";

/** Payment model for mongodb */

const mongoose = require("mongoose");

const Payment = mongoose.model(
  "Payment",
  new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    fee: Number,
    date: Date,
  })
);

module.exports = Payment;
