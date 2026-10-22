// Connects to MongoDB using the connection string stored in .env
const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Create a .env file (see .env.example).');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected:', mongoose.connection.host, '/', mongoose.connection.name);
};

module.exports = connectDB;
