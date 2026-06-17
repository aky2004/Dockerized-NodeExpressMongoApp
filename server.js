const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URL
// const MONGO_URI = 'mongodb://localhost:27017';
const MONGO_URI ='mongodb://root:password@host.docker.internal:27017/?authSource=admin';
const DB_NAME = 'myTry';
const COLLECTION_NAME = 'users';

let db;

// Connect to MongoDB
async function connectMongo() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(express.json());

// Route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection(COLLECTION_NAME).find({}).toArray();
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route to fetch a specific user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const user = await db.collection(COLLECTION_NAME).findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, async () => {
  await connectMongo();
  console.log(`Server running on http://localhost:${PORT}`);
});
