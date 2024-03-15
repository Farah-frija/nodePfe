const mongoose = require("mongoose");
require('dotenv').config();

async function connectToDB() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To MongoDB...");
  } catch (error) {
    console.log(process.env.MONGO_URI)
    console.log("Connection Failed To MongoDB!", error);
  }
}

module.exports = connectToDB;

