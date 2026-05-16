const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri.includes('<user>')) {
      console.log('No MONGO_URI configured — starting in-memory MongoDB (dev only)');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      uri = mem.getUri();
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
