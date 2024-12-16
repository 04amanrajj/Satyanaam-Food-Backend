const { OrderModel } = require("../models/order.model");

exports.getOrder = async (req, res) => {
  try {
    const userID = req.userID;
    const { userName, userPhone } = req.body;
    const { status } = req.query;

    let filter = {};

    if (userID) {
      filter.userID = userID;
    } else if (userName || userPhone) {
      filter.$or = [];
      if (userName) filter.$or.push({ userName: userName });
      if (userPhone) filter.$or.push({ userPhone: userPhone });
    } else {
      return res.status(400).send({
        message: "No orders yet",
      });
    }

    if (status) filter.status = status;

    const orders = await OrderModel.find(filter);
    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders yet" });
    }
    logger.info(`${userName || userID} (${userPhone}) looking for orders.`);
    res.status(200).send(orders);
  } catch (error) {
    logger.error(`Error showing orders: ${error.message}`);
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
    logger.info(`${userName} (${userPhone}) Placed new order.`);
    res.status(200).send({ data: order, message: "Order placed" });
  } catch (error) {
    logger.error(`Error processing order: ${error.message}`);
    console.error("Error processing order:", error.message);
    res.status(500).send({ message: error.message });
  }
};
