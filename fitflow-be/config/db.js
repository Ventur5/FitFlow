const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Db connection error', error);
    process.exit(1);
  }
};

module.exports = connectDB;
