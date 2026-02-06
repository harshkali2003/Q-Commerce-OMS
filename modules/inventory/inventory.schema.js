const mongoose = require("mongoose")
const inventorySchema = new mongoose.Schema({
    BatchId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Batch",
        required : true,
    },
    storeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Store",
        required : true,
    },
    skuId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Sku",
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
        min : 0,
    },
})

module.exports = mongoose.model("Inventory" , inventorySchema);