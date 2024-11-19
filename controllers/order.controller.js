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
    const status = "pending";
    const userID = req.userID;

    const cart = await CartModel.findOne({ userID, _id: cartID });
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    // check for existing order with this userID
    const existingOrder = await OrderModel.findOne({
      userID,
      status: "pending",
    });
    if (existingOrder)
      return res
        .status(409)
        .send({ message: "there's a pending order from this user" });

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
    if (role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });

    const orderID = req.params.id;
    const { status } = req.body;
    // check for valid orders
    const order = await OrderModel.findOne({ _id: orderID });
    if (!order) return res.status(404).send({ message: "Order not found" });

    await OrderModel.findOneAndUpdate({ _id: orderID }, { status });

    res.status(200).send("order updated");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
