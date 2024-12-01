// reset
// login
// signup

const { MenuModel } = require("../models/menu.model");
const { OrderModel } = require("../models/order.model");

// reset menu
exports.resetMenu = async (req, res) => {
  try {
    if (req.role !== "admin")
      return res.status(403).send({ message: "You are not authorized" });

    // create backup
    // pending...

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
    res.status(200).send({ message: "menu reset: ok", data: newItems });
  } catch (error) {
    console.log(error.message);
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

    res.status(200).send({ message: "new dish added" });
  } catch (error) {
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

    await MenuModel.findOneAndUpdate({ _id }, payload);

    res.status(200).send({ message: "dish updated" });
  } catch (error) {
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
    const dish = await MenuModel.findByIdAndDelete({ _id });
    if (!dish) return res.status(404).send({ message: "dish not found" });

    res.status(200).send({ message: "dish deleted" });
  } catch (error) {
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

    res.status(200).send("order updated");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
