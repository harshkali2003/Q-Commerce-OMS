const express = require("express");
const router = express.Router();

const {verifyToken} = require("../../middleware/jwt.middleware")
const {accessRole} = require("../../middleware/role.middleware")
const storeController = require("./store.controller")

router.post("/store/create" , verifyToken , accessRole("ADMIN") , storeController.CreateStore)

router.put("/store/update/:id" , verifyToken , accessRole("ADMIN") , storeController.UpdateStore)

router.get("/store/all" , verifyToken , accessRole("ADMIN") , storeController.GetAllStores)

router.post("/store/active/:id" , verifyToken , accessRole("ADMIN" , "STORE MANAGER") , storeController.ActivateStore)

router.post("/store/deactive/:id" , verifyToken , accessRole("ADMIN" , "STORE MANAGER") , storeController.DeActivateStore)

router.get("/store/get/:query" , verifyToken , accessRole("ADMIN") , storeController.getStoreByPincode)

router.post("/store/allocate" , verifyToken , accessRole("ADMIN") , storeController.AllocateStore)

module.exports = router;