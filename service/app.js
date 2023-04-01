"use strict";

/** Express app for stripe_test backend */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function setupApp() {
  // Register models
  const User = require("../models/User");
  const Payment = require("../models/Payment");

  // Register routes
  app.use(require("../routes/auth")(User));
  app.use(require("../routes/payment")(User, Payment));

  return app;
}

module.exports = setupApp;
