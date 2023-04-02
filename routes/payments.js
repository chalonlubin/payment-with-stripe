"use strict";

/** Routes for payments. */

const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const User = require("../models/User");

/** Records payment in database */
router.post("/create", async (req, res) => {
  const { from, to, cost } = req.body;

  const fromUser = await User.findOne({ username: from });
  const toUser = await User.findOne({ username: to });

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
      await payment.save();
      res.json({ message: "Payment created successfully", payment })
    } catch(e) {
      return res.status(400).json({ message: "Payment failed, try again later" });
    }
  } else {
    return res.status(400).json({ message: "One or both users not found" });
  }
});

router.post("/charge", (req, res) => {

})

module.exports = router;
