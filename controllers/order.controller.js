const { OrderModel } = require("../models/order.model");
const { CartModel } = require("../models/cart.model");

exports.getOrder = async (req, res) => {
  try {
    const userID = req.userID;
    const { status } = req.query;
    let filter = {};
    filter.userID = userID;
    if (status) filter.status = status;

    console.log(filter);
    const order = await OrderModel.find(filter);
    if (!order[0]) throw new Error("No orders found from this user");

    res.status(200).send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.newOrder = async (req, res) => {
  try {
    const cartID = req.body.cartid;
    const status = "pending";
    const userID = req.userID;

    const cart = await CartModel.findOne({ userID, _id: cartID });
    if (!cart) throw new Error("Cart not found");

    // check for existing order with this userID
    const existingOrder = await OrderModel.findOne({ userID });
    if (existingOrder)
      throw new Error("there's a pending order from this user");

    const order = new OrderModel({
      userID,
      items: cart.items,
      totalprice: cart.totalprice,
      status,
    });
    await order.save();

    // remove cart
    await CartModel.findOneAndDelete({ _id: cartID });
    
    res.status(200).send({ data: order, cart });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const role = req.role;
    if (role !== "admin") throw new Error("You are unauthorized");

    const orderID = req.params.id;
    const { status } = req.body;
    // check for valid orders
    const order = await OrderModel.findOne({ _id: orderID });
    if (!order) throw new Error("Order not found");

    await OrderModel.findOneAndUpdate({ status });

    res.status(200).send("order updated");
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: error.message });
  }
};
