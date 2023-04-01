"use strict";

/** Payment model for mongodb */


const mongoose = require("mongoose");

  const paymentSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    fee: Number,
    date: Date,
  });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

