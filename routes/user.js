"use strict";

module.exports = (database) => {
  const router = require('express').Router();
  const Payment = database.model('Payment');
  const User = database.model('User');

  // TODO: Create routes.

  return router;
};
