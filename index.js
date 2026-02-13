const express = require("express");
const app = express()

require("./service/cron.expiry");
require("dotenv").config()

const errorHandler = require("./middleware/error.middleware")

app.use(errorHandler);

app.listen(process.env.PORT , () => {
    console.log(`server is running at ${process.env.PORT}`);
})