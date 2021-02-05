const mongoose = require('mongoose');
const config = require('config');
const mongoDb = config.get('mongodb');

const connectDb = async () => {
  try {
    await mongoose.connect(mongoDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
