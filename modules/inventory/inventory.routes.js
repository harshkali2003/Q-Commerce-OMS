const express = require("express");
const router = express.Router();

const inventoryController = require("./inventory.controller");
const { verifyToken } = require("../../middleware/jwt.middleware");
const { accessRole } = require("../../middleware/role.middleware");

router.post(
  "/stock/in",
  verifyToken,
  accessRole("ADMIN", "STORE MANAGER"),
  inventoryController.StockIn,
);

router.post(
  "/stock/out",
  verifyToken,
  accessRole("ADMIN", "STORE MANAGER", "USER"),
  inventoryController.StockOut,
);

router.get(
  "/stock/lowStock",
  verifyToken,
  accessRole("ADMIN", "STORE MANAGER"),
  inventoryController.LowStockAlert,
);

router.get(
  "/stock/info",
  verifyToken,
  accessRole("ADMIN", "STORE MANAGER"),
  inventoryController.getAllInventoryInfo,
);

router.get(
  "/stock//movement",
  verifyToken,
  accessRole("ADMIN", "STORE MANAGER"),
  inventoryController.StockMovementLog,
);

router.get(
  "/store/performance",
  verifyToken,
  accessRole("ADMIN", "STORE MANAGER"),
  inventoryController.StorePerformance,
);

module.exports = router;
