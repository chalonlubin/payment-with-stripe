"use strict";

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

/** return signed JWT {username, role, email} from user data. */
function createToken(user) {
  return jwt.sign(
    {
      payload: {
        username: user.username,
        role: user.role,
      },
    },
    SECRET_KEY,
    { expiresIn: "1d" }
  );
}

module.exports = { createToken };
