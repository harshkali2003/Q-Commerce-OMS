const express = require("express");
const router = express.Router();

const cartController = require("./cart.controller")
const {verifyToken} = require("../../middleware/jwt.middleware")
const {accessRole} = require("../../middleware/role.middleware")

router.post("/store/assign" , verifyToken , accessRole("USER" , "STORE MANAGER" , "ADMIN") , cartController.AssignStoreToCart)

module.exports = router;