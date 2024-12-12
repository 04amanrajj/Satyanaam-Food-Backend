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
    const { cart, userAddress, userMSG, userName, userPhone } = req.body;
    const status = "Pending";
    const userID = req.userID;

    let confirmOrder = {
      userName,
      userPhone,
      items: cart.items,
      totalprice: parseFloat(cart.totalprice.toFixed(2)),
      userAddress,
      status,
    };

    if (userID) confirmOrder.userID = userID;
    if (userMSG) confirmOrder.userMSG = userMSG;

    const order = new OrderModel(confirmOrder);
    await order.save();

    res.status(200).send({ data: order, message: "Order placed" });
  } catch (error) {
    console.error("Error processing order:", error.message);
    res.status(500).send({ message: error.message });
  }
};
