"use strict";

const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

router.post("/create", async (req, res) => {
  const { from, to, amount } = req.body;

  const payment = new Payment({
    from,
    to,
    amount,
  });

  await payment.save();
  res.json({ message: "Payment created successfully", payment });
});

module.exports = router;