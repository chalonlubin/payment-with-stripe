"use strict";

const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const User = require("../models/User");

router.post("/create", async (req, res) => {
  const { from, to, cost } = req.body;
  console.log('req.body',req.body);

  const fromUser = await User.findOne({ username: from });
  const toUser = await User.findOne({ username: to });
  console.log('fromUser',fromUser.username);
  console.log('toUser',toUser.username);


  if (fromUser && toUser) {
    try {
      let currentDate = new Date().toJSON().slice(0, 10);
      const payment = new Payment({
        from: fromUser,
        to: toUser,
        cost: cost,
        fee: (cost * 0.01),
        total: (cost * 1.01),
        date: currentDate,
      });
      console.log(payment)
      await payment.save();
      res.json({ message: "Payment created successfully", payment })
    } catch(e) {
      return res.status(400).json({ message: "Payment failed, try again later", e });
    }
  } else {
    return res.status(400).json({ message: "One or both users not found" });
  }
});

module.exports = router;
