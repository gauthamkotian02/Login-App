const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const ConnectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection to mongo is a success");
  } catch (err) {
    console.log("Connection to mongo is Unsuccessful", err);
  }
};

module.exports = ConnectToMongo;
