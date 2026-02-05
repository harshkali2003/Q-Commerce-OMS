const mongoose = require("mongoose");
const productData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {timestamps : true});

module.exports = mongoose.model("Product", productData);
