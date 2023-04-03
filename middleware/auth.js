"use strict";
const jwt = require("jsonwebtoken");


/** Authentication middleware for routes */

/** Checks for correct JWT */
function authenticateJWT(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Missing authentication token" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded.payload;
    next();
  });
}

/** Verifies correct role for route access */
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access denied, insufficient permissions" });
    }
    next();
  };
}

module.exports = {
  authenticateJWT,
  authorizeRole,
};
