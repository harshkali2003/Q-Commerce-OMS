const mongoose = require("mongoose");
require("dotenv").config();
const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.warn(err));

// mongod --replSet rs0 --dbpath C:\data\db

// Open another terminal: mongosh

// rs.initiate()