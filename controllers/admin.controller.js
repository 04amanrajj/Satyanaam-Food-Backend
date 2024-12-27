// reset
// login
// signup
const fs = require("fs").promises;
const path = require("path");

const { logger } = require("../middlewares/userLogger.middleware");
const { MenuModel } = require("../models/menu.model");
const { OrderModel } = require("../models/order.model");
const { UserModel } = require("../models/user.model");
const { client } = require("../configs/redis");

// reset menu
exports.resetMenu = async (req, res) => {
  try {
    if (req.role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });

    // creating backup stops reseting menu
    // Create timestamped backup filename
    // const date = new Date();
    // const timestamp = `${String(date.getDate()).padStart(2, "0")}-${String(
    //   date.getMonth() + 1
    // ).padStart(2, "0")}-${date.getFullYear()}-${String(
    //   date.getHours()
    // ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    //   date.getSeconds()
    // ).padStart(2, "0")}`;
    // const backupFilename = `backup-[${timestamp}].json`;

    // let backupPath = path.join(
    //   __dirname,
    //   "../resources/backup",
    //   backupFilename
    // );

    // const currentMenu = await MenuModel.find();

    // // Write the backup file
    // await fs.writeFile(backupPath, JSON.stringify(currentMenu, null, 2));
    // logger.info(`Menu backup created successfully: ${backupFilename}`);

    // reset all items
    await MenuModel.collection.drop();
    const menuItems = require("../resources/menu.json");
    const menuEntries = Object.keys(menuItems).map((category) => ({
      items: menuItems[category],
    }));
    for (const element of menuEntries) {
      for (const ele of element.items) {
        const item = new MenuModel(ele);
        await item.save();
      }
    }
    const newItems = await MenuModel.find();
    logger.warn(`performed menu reset`);
    res.status(200).send({ message: "menu reset: ok", data: newItems });
  } catch (error) {
    logger.error(`Error resetting menu: ${error.stack || error.message}`);
    console.log(error.stack || error.message);
    res.status(403).send({ message: error.message });
  }
};

// add menu item
exports.addMenuItem = async (req, res) => {
  try {
    if (req.role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });
    const payLoad = req.body;

    // check item
    const dish = await MenuModel.findOne({ name: payLoad.name });
    if (dish)
      return res.status(409).send({ message: "dish exists with this name" });

    const newDish = new MenuModel(payLoad);
    await newDish.save();
    logger.warn(`Added ${payLoad.name}`);
    res.status(200).send({ message: "new dish added" });
  } catch (error) {
    logger.error(`Error adding item: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    if (req.role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });
    const _id = req.params.id;
    const payload = req.body;

    // check item
    const dish = await MenuModel.findOne({ _id });
    if (!dish) return res.status(404).send({ message: "dish not found" });
    logger.warn(`updated ${dish.name}`);
    await MenuModel.findOneAndUpdate({ _id }, payload);
    res.status(200).send({ message: "dish updated" });
  } catch (error) {
    logger.error(`Error updating item: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    if (req.role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });
    const _id = req.params.id;

    // check & delete item
    const dish = await MenuModel.findOne({ _id });
    if (!dish) return res.status(404).send({ message: "dish not found" });
    logger.warn(`deleted ${dish.name}`);
    await MenuModel.findByIdAndDelete({ _id });
    res.status(200).send({ message: "dish deleted" });
  } catch (error) {
    logger.error(`Error deleting item: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
// get all orders
exports.getOrders = async (req, res) => {
  try {
    if (req.role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });

    const { status } = req.query;
    let filter = {};
    // filter.role = "admin";
    if (status) filter.status = status;

    // check on redis
    const cached_data = await client.get(`admin-orders:${JSON.stringify(filter)}`);
    if (cached_data) {
      logger.info("Orders data found on Redis");
      res.status(200).send(JSON.parse(cached_data));
      return;
    }

    const order = await OrderModel.find(filter);
    if (order.length == 0)
      return res.status(404).send({ message: "No orders found" });

    await client.set(`admin-orders:${JSON.stringify(filter)}`, JSON.stringify(order), {
      EX: 600, //will expire after 1min
    });

    logger.warn(`${req.role} looked for all orders`);
    res.status(200).send(order);
  } catch (error) {
    logger.error(`Error showing orders (admin): ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// update order
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
    logger.warn(`order updated ${orderID}`);
    res.status(200).send("order updated");
  } catch (error) {
    logger.error(`Error updating order: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// specific user
exports.users = async (req, res) => {
  try {
    let param = {};
    if (req.body.userid) param._id = req.body.userid;
    const users = await UserModel.find(param);
    if (!users) return res.status(404).send({ message: "No user found" });
    res.status(200).send({ message: users });
  } catch (error) {
    logger.error(`Error showing user (admin): ${error.message}`);
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};
