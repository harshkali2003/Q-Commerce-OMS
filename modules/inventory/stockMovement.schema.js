const mongoose = require("mongoose")
const stockMovementSchema = new mongoose.Schema({
    SkuId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SKU",
    },
    BatchId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Batch",
    },
    StoreId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Store",
    },
    quantity : {
        type : Number,
        required : true,
    },
    type : {
        type : String,
        enum : ["IN" , "OUT"]
    },
    reason : {
        type : String,
        required : true,
    }
} , {timestamps : true});

module.exports = mongoose.model("StockMovementLog" , stockMovementSchema);