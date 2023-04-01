const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());


const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const database = client.db('StripeTestDB');

    // Register models and routes
    require('./models/User')(database);
    require('./models/Payment')(database);
    app.use(require('./routes/auth')(database));
    app.use(require('./routes/payment')(database));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

connectMongoDB().catch(console.dir);
