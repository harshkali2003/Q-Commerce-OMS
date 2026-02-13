const mongoose = require("mongoose");
const StockMovementLog = require("./stockMovement.schema");
const InventorySchema = require("./inventory.schema");
const OrderSchema = require("../order/order.schema");

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

exports.getAllInventoryInfo = async (req, resp) => {
  try {
    const data = await InventorySchema.aggregate([
      {
        $group: {
          _id: { skuId: "$skuId", storeId: "$storeId" },
          quantity: { $sum: "$quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.skuId",
          totalQuantity: { $sum: "$quantity" },
          stores: {
            $push: {
              storeId: "$_id.storeId",
              quantity: "$quantity",
            },
          },
        },
      },
      {
        $project: {
          id: 0,
          skuId: "$_id",
          totalQuantity: 1,
          stores: 1,
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
    ]);

    resp.status(200).json({ data });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.StockMovementLog = async (req, resp) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setHours(0, 0, 0, 0));

    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date(new Date().setHours(23, 59, 59, 999));

    if (isNaN(startDate) || isNaN(endDate)) {
      return resp.status(400).json({ message: "Invalid date format" });
    }

    const matchStage = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (req.query.skuId) matchStage.skuId = req.query.skuId;
    if (req.query.storeId) matchStage.storeId = req.query.storeId;
    if (req.query.type) matchStage.type = req.query.type;

    const data = await StockMovementLog.aggregate([
      {
        $match: matchStage,
      },
      {
        $project: {
          _id: 0,
          skuId: 1,
          storeId: 1,
          quantity: 1,
          type: 1,
          reason: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    resp.status(200).json({ data });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.StorePerformance = async (req, resp) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setHours(0, 0, 0, 0));

    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date(new Date().setHours(23, 59, 59, 999));

    if (isNaN(startDate) || isNaN(endDate)) {
      return resp.status(400).json({ message: "Invalid date format" });
    }
    const data = await OrderSchema.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$storeId",
          totalOrders: { $sum: 1 },
          deliveredOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0],
            },
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0],
            },
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "DELIVERED"] }, "$totalAmount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          storeId: "$_id",
          totalOrders: 1,
          deliveredOrders: 1,
          cancelledOrders: 1,
          revenue: 1,
          successRate: {
            $cond: [
              { $eq: ["$totalOrders", 0] },
              0,
              { $divide: ["$deliveredOrders", "$totalOrders"] },
            ],
          },
        },
      },
      {
        $sort: { successRate: -1 },
      },
    ]);

    resp.status(200).json({ data });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};
