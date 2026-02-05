const mongoose = require("mongoose");
const skuSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },

  mrp: {
    type: Number,
    required: true,
  },

  selling_price: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {timestamps : true});

module.exports = mongoose.model("SKU", skuSchema);
