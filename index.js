const express = require("express");
const cors = require("cors");
const app = express();

require("./config/db")
require("./service/cron.expiry");
require("dotenv").config()

const errorHandler = require("./middleware/error.middleware")
const cart = require("./modules/cart/cart.routes")
const inventory = require("./modules/inventory/inventory.routes")
const order = require("./modules/order/order.routes")
const store = require("./modules/stores/store.routes")
const user = require("./modules/user/auth.routes");

app.use(errorHandler);
app.use(express.json())
app.use(cors({
    origin : '*',
    methods : ['GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE'],
    credentials : true,
}))

app.use("/" , user);
app.use("/cart" , cart);
app.use("/inventory" , inventory)
app.use("/order" , order);
app.use("/store" , store);

app.listen(process.env.PORT , () => {
    console.log(`server is running at ${process.env.PORT}`);
})