const inventoryService = require("../../service/inventory.service");
const inventorySchema = require("../inventory/inventory.schema");
const skuSchema = require("../sku/sku.schema");
const orderSchema = require("./order.schema");

exports.placeOrder = async (req, resp) => {
  const { orderId, skuId, quantity } = req.body;

  try {
    await inventoryService.ReserveInventory(orderId, skuId, quantity);
    resp.status(200).json({ message: "Inventory reserved" });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.paymentFailed = async (req, resp) => {
  const { orderId } = req.body;
  try {
    await inventoryService.ReleaseInventory(orderId);
    resp.status(200).json({ message: "Inventory released" });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.confirmPayment = async (req, resp) => {
  const { orderId } = req.body;
  try {
    await inventoryService.ConfirmOrder(orderId);
    resp.status(200).json({ message: "Order confirmed" });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.CreateOrder = async (req, resp) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return resp
        .status(400)
        .json({ message: "User is not logged in or not found" });
    }
    const { items } = req.body;
    if (items.length < 1) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    let Items = [];
    let totalAmount = 0;
    for (const item of items) {
      const { id, quantity } = item;
      if (quantity <= 0) {
        return resp.status(400).json({ message: "Invalid quantity" });
      }

      const sku = await skuSchema.findById(id);
      if (!sku) {
        return resp.status(404).json({ message: "Sku not found" });
      }

      const isAvailable = await inventorySchema.findOne({ SkuId: id });
      if (!isAvailable || isAvailable.quantity < quantity) {
        return resp
          .status(404)
          .json({ message: "Stock is less than required" });
      }

      Items.push({
        quantity,
        skuId: sku._id,
      });

      totalAmount += quantity * sku.selling_price;
    }

    const orderId = `ORD-${Date.now()}`;
    const order = await orderSchema.create({
      orderId: orderId,
      userId: user,
      items: Items,
      totalAmount: totalAmount,
      status: "CREATED",
    });

    resp.status(201).json({ message: "Order created", order });
  } catch (err) {
    console.log(err.message);
    resp.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrder = async (req, resp) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return resp.status(400).json({ message: "Status is required" });
    }

    const allowedTransitions = {
      CREATED: ["RESERVED"],
      RESERVED: ["PICKED"],
      PICKED: ["PACKED"],
      PACKED: ["OUT"],
      OUT: ["DELIVERED"],
    };

    const order = await orderSchema.findOne({ orderId });
    if (!order) {
      return resp.status(404).json({ message: "No Order found" });
    }

    if (order.status === "DELIVERED") {
      return resp.status(400).json({ message: "Order already delivered" });
    }

    if (!allowedTransitions[order.status]?.includes(status)) {
      return resp.status(400).json({ message: "Invalid status transition" });
    }

    order.status = status;
    await order.save();

    resp.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.log(err.message);
    resp.status(500).json({ message: "Internal server error" });
  }
};
