"use strict";

/** Routes for payments. */

const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PLATFORM_OWNER_STRIPE_ACCOUNT_ID =
  process.env.PLATFORM_OWNER_STRIPE_ACCOUNT_ID;

/** Creates a charge and records payment in the database */
router.post("/create", async (req, res) => {
  const {
    from,
    to,
    cost,
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCVC,
    country,
    postalCode,
  } = req.body;

  if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
    return res.status(400).send({
      Error: "Necessary Card Details are required for One Time Payment",
    });
  }

  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCVC,
        address_state: country,
        address_zip: postalCode,
      },
    });

    const fromUser = await User.findOne({ username: from });
    const toUser = await User.findOne({ username: to });
    console.log("toUser:", toUser)
    console.log("fromUser:", fromUser)

    if (!fromUser || !toUser) {
      return res.status(400).json({ message: "One or both users not found" });
    }

    const charge = await stripe.charges.create({
      amount: Math.round(cost * 1.01 * 100), // Stripe accepts the amount in cents
      currency: "usd",
      source: cardToken.id,
      description: `Stripe Charge Of Amount ${cost} for One Time Payment`,
    });

    if (charge.status === "succeeded") {
      const transferToUser = await stripe.transfers.create({
        amount: Math.round(cost * 0.99 * 100), // 99% to toUser
        currency: "usd",
        destination: toUser.billingID,
        source_transaction: charge.id,
      });

      const transferToPlatformOwner = await stripe.transfers.create({
        amount: Math.round(cost * 0.01 * 100), // 1% to platform owner
        currency: "usd",
        destination: PLATFORM_OWNER_STRIPE_ACCOUNT_ID,
        source_transaction: charge.id,
      });

      let currentDate = new Date().toJSON().slice(0, 10);
      const payment = new Payment({
        from: fromUser,
        to: toUser,
        cost: cost,
        fee: cost * 0.01,
        total: cost * 1.01,
        date: currentDate,
      });
      await payment.save();

      res.json({ message: "Payment created successfully", payment });
    } else {
      return res
        .status(400)
        .send({ Error: "Please try again later for One Time Payment" });
    }
  } catch (error) {
    return res.status(400).send({
      Error: error.raw.message,
    });
  }
});

module.exports = router;
