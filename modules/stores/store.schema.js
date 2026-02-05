const mongoose = require("mongoose");
const storeData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pincodes: {
      type: [Number],
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Store", storeData);
