const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema({
  batchCode: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  skuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sku",
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "EXPIRED"],
    default: "ACTIVE",
  },
});

batchSchema.index({ batchCode: 1, skuId: 1 }, { unique: true });

batchSchema.methods.isExpired = function () {
  return this.expiryDate < new Date();
};

module.exports = mongoose.model("Batch", batchSchema);
