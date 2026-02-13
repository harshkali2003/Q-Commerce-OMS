const mongoose = require("mongoose");
const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ["ORDER", "INVENTORY", "USER"],
      default: "USER",
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    performedBy: {
      type: String,
      enum: ["SYSTEM", "USER", "CRON"],
      required: true,
    },
    performedById: {
      type: String, // userId / adminId / service name
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    reason: {
      type: String,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    requestId: {
      type: String, // links audit to Winston logs
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Audit", auditSchema);
