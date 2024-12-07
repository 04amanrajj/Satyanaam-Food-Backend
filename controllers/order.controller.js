const { OrderModel } = require("../models/order.model");
const { CartModel } = require("../models/cart.model");

exports.getOrder = async (req, res) => {
  try {
    const userID = req.userID;
    const { status } = req.query;
    let filter = {};
    filter.userID = userID;
    if (status) filter.status = status;

    const order = await OrderModel.find(filter);
    if (order.length == 0)
      return res
        .status(404)
        .send({ message: "No orders found from this user" });

    res.status(200).send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.newOrder = async (req, res) => {
  try {
    const cartID = req.body.cartid;
    const status = "Pending";
    const userID = req.userID;

    const cart = await CartModel.findOne({ userID, _id: cartID });
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    const order = new OrderModel({
      userID,
      items: cart.items,
      totalprice: cart.totalprice.toFixed(2),
      status,
    });
    await order.save();
    // remove from cart
    await CartModel.findOneAndDelete({ _id: cartID });

    res.status(200).send({ data: order });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
