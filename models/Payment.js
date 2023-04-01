"use strict";

/** Payment model for mongodb */

const mongoose = require("mongoose");

const Payment = mongoose.model(
  "Payment",
  new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cost: Number,
    fee: Number,
    date: Date,
    total: Number,
  })
);

module.exports = Payment;
