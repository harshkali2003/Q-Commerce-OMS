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
    storePriority: {
      type: Number,
      default: 1,
      index: 1,
    },
    deliverableRadius: {
      type: Number,
      default: 1,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
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

storeData.index({ location: "2dsphere" });

module.exports = mongoose.model("Store", storeData);
