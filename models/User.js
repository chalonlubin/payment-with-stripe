module.exports = (database) => {
  const { Schema, model } = require("mongoose");

  const userSchema = new Schema({
    username: String,
    firstName: String,
    lastName: string,
    email: String,
    password: String,
    isAdmin: Boolean,
    type: String,
    stripeCustomerId: String,
  });
  database.model("User", userSchema);
};

