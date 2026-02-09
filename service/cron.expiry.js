const cron = require("node-cron");
const mongoose = require("mongoose");

const productSchema = require("../modules/product/product.schema");

const EXPIRY_ALERT_DAYS = 7;

cron.schedule("0 0 * * *" , async () => {
    try{
        console.log("Expiry Products is checking");
        
        const today = new Date();
        const alertDate = new Date();

        alertDate.setDate(today.getDate() + EXPIRY_ALERT_DAYS);

        const expiredProduct = await productSchema.find({
            expiryDate : {
                $gte : today,
                $lte : alertDate,
            }
        })

        if(expiredProduct.length > 1){
            expiredProduct.forEach(p => {
                console.log(`product ${p.name} is expired on ${p.expiryDate}`);
            })
        }
    } catch(error){
        console.error("❌ Expiry cron failed:", error.message);
    }
})