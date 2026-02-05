const mongoose = require("mongoose");
const userData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "STORE MANAGER", "ADMIN"],
      default: "CUSTOMER",
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: function () {
        return this.role === "STORE_MANAGER";
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userData);
