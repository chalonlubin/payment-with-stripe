"use strict";

const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;


async function connectMongoDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}


module.exports = connectMongoDB;
