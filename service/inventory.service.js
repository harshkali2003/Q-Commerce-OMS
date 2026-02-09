const redisClient = require("../config/redis");

exports.ReserveInventory = async (orderId , skuId , quantity) => {
    const inventoryKey = `inventory${skuId}`
    const reservationKey = `reservation${orderId}`

    const stock = await redisClient.get(inventoryKey);
    if(stock || stock < quantity){
        throw new Error("Insufficient stock")
    }

    await redisClient.decr(inventoryKey , quantity);

    await redisClient.set(
        reservationKey,
        JSON.stringify({quantity , skuId}),
        {EX : 600}
    );

    return true;
}

exports.ReleaseInventory = async (orderId) => {
    const reservationKey = `reservation${orderId}`
    const reservation = await redisClient.get(reservationKey)

    if(!reservation) return;

    const {skuId , quantity} = JSON.parse(reservation);

    await redisClient.incrBy(`inventory${skuId}` ,  quantity);
    await redisClient.del(reservationKey);
}

exports.ConfirmOrder = async (orderId) => {
    await redisClient.del(`reservation${orderId}`)
}