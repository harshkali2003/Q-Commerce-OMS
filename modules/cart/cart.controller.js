const Cart = require("./cart.schema");
const Store = require("../stores/store.schema");

exports.AssignStoreToCart = async (req, resp) => {
  try {
    const userId = req.user.id;
    const { pincode } = req.body;

    if (!pincode?.length) {
      return resp.status(400).json({ message: "Enter valid pincode" });
    }

    const store = await Store.findOne({
      pincodes: pincode,
      isActive: true,
    });

    if (!store) {
      return resp
        .status(404)
        .json({ message: "Service not available at your location" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        storeId: store._id,
        items: [],
      });

      return resp
        .status(201)
        .json({ message: "Store assigned to new car", cart });
    }

    // same store 
    if (cart.storeId.toString() === store._id.toString()) {
      return resp.status(200).json({
        message: "Store already assigned to cart",
        cart,
      });
    }

    // different store , reset cart
    cart.storeId = store._id;
    cart.items = [];
    await cart.save();

    resp.status(201).json({ message: "Store changed and cart reset", cart });
  } catch (err) {
    console.log(err);
  }
};
