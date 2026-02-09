const mongoose = require("mongoose")
const inventorySchema = new mongoose.Schema({
    BatchId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Batch",
        required : true,
    },
    StoreId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Store",
        required : true,
    },
    SkuId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Sku",
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
        min : 0,
    },
    lowStock : {
        type : Number,
        default : 50,
    }
} , {timestamps : true})

module.exports = mongoose.model("Inventory" , inventorySchema);