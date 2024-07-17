const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectionString = process.env.CONNECTION_STRING;

// connection with database
const mongoConnection = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected with Database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoConnection;
