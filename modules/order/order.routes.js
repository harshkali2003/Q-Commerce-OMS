const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");
const { verifyToken } = require("../../middleware/jwt.middleware");
const { accessRole } = require("../../middleware/role.middleware");

router.post("/order/place" , verifyToken , accessRole("USER") , orderController.placeOrder)

router.post("/order/failed" , verifyToken , accessRole("USER") , orderController.paymentFailed)

router.post("/order/confirm" , verifyToken , accessRole("USER") , orderController.confirmPayment)

router.post("/order/create" , verifyToken , accessRole("USER" , "ADMIN") , orderController.CreateOrder)

router.post("/order/update/:orderId" , verifyToken , accessRole("STORE MANAGER") ,orderController.updateOrder)

router.post("/order/rollback" , verifyToken , accessRole("USER") , orderController.rollbackOrder)

router.get("/order/pickingList" , verifyToken , accessRole("ADMIN" , "STORE MANAGER") , orderController.getPickingList)

module.exports = router;