"use strict";

const dotenv = require("dotenv");
dotenv.config();

const connectMongoDB = require("./service/db");
const setupApp = require("./service/app");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectMongoDB();
    const app = await setupApp();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    process.exit(1);
  }
}

startServer();






