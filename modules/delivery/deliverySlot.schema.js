const mongoose = require("mongoose");
const slotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
    },
    availableCapacity: {
      type: Number,
      required: true,
    },
    slotType: {
      type: String,
      enum: ["NORMAL", "EXPRESS", "SAME_DAY"],
      default: "NORMAL",
    },
    zone: {
      type: {
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
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cutoff_time : {
        type : Date,
        required : true,
    }
  },
  { timestamps: true },
);

slotSchema.index({ zone: "2dsphere" });

module.exports = mongoose.model("Delivery", slotSchema);
