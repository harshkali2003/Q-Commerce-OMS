const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        skuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sku",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "CREATED",
        "RESERVED",
        "PICKED",
        "PACKED",
        "OUT",
        "DELIVERED",
        "CANCELLED",
      ],
      required: true,
      default : "CREATED",
    },
    slotId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Delivery",
    },
    reason: {
      type: String,
    },
    rollBackAt : {
      type : Date ,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
