const mongoose = require("mongoose");
const StockMovementLog = require("./stockMovement.schema");
const InventorySchema = require("./inventory.schema");

exports.StockIn = async (req, resp) => {
  const session = await mongoose.startSession();

  try {
    const { BatchId, SkuId, StoreId, quantity } = req.body;
    if (!BatchId || !SkuId || !StoreId || !quantity) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    if (quantity <= 0) {
      return resp
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    session.startTransaction();

    let inventory = await InventorySchema.findOne(
      { BatchId, SkuId, StoreId },
      null,
      { session },
    );

    if (!inventory) {
      inventory = await InventorySchema({
        BatchId,
        SkuId,
        StoreId,
        quantity,
      });

      await inventory.save({ session });
    } else {
      inventory.quantity += quantity;
      await inventory.save({ session });
    }

    const transactionLog = await StockMovementLog.create(
      [
        {
          BatchId,
          SkuId,
          StoreId,
          quantity,
          type: "IN",
          reason: "STOCK_REPLENISHED",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    resp
      .status(201)
      .json({ message: "Stock has been added", inventory, transactionLog });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.StockOut = async (req, resp) => {
  const session = await mongoose.startSession();

  try {
    const { BatchId, SkuId, StoreId, quantity } = req.body;
    if (!BatchId || !SkuId || !StoreId || !quantity) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    if (quantity <= 0) {
      return resp
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    session.startTransaction();

    const inventory = await InventorySchema.findOne(
      { BatchId, SkuId, StoreId },
      null,
      { session },
    );

    if (!inventory) {
      await session.abortTransaction();
      session.endSession();
      return resp.status(404).json({ message: "Inventory doesn't exist" });
    }

    if (inventory.quantity < quantity) {
      await session.abortTransaction();
      session.endSession();
      return resp.status(400).json({ message: "Insufficient stock" });
    }

    inventory.quantity -= quantity;
    await inventory.save({ session });

    const transactionLog = await StockMovementLog.create(
      [
        {
          BatchId,
          SkuId,
          StoreId,
          quantity,
          type: "OUT",
          reason: "Stock sold",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    resp
      .status(200)
      .json({ message: "Stock_Deducted", inventory, transactionLog });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.LowStockAlert = async (req, resp) => {
  try {
    const { BatchId, SkuId, StoreId } = req.body;
    if (!BatchId || !SkuId || !StoreId) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    const inventory = await InventorySchema.findOne({
      BatchId,
      SkuId,
      StoreId,
    });
    if (!inventory) {
      return resp.status(404).json({ message: "Inventory not found" });
    }

    const lowStock = inventory.quantity <= inventory.lowStock;

    return resp.status(200).json({
      SkuId: inventory.SkuId,
      StoreId: inventory.StoreId,
      BatchId: inventory.BatchId,
      quantity: inventory.quantity,
      lowStock: inventory.lowStock,
      status: lowStock ? "LOW_STOCK" : "HEALTHY",
      alert: lowStock
        ? "Stock is low, refill required"
        : "Stock level is healthy",
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};
