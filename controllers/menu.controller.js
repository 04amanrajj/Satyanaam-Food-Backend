const { MenuModel } = require("../models/menu.model");

exports.resetController = async (req, res) => {
  try {
    if (req.role !== "admin") throw new Error("You are not authorized");

    // create backup

    // reset all items
    await MenuModel.collection.drop();
    const menuItems = require("../resources/menu.json");
    const menuEntries = Object.keys(menuItems).map((category) => ({
      items: menuItems[category],
    }));
    menuEntries.forEach((element) => {
      element.items.forEach(async (ele) => {
        const item = new MenuModel(ele);
        await item.save();
      });
    });
    const newItems = await MenuModel.find();
    res.status(200).send({ message: "menu reset: ok", data: newItems });
  } catch (error) {
    console.log(error.message);
    res.status(403).send({ message: error.message });
  }
};

exports.getItemsControllers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minprice,
      maxprice,
      q,
    } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (minprice) filter.price = { ...filter.price, $gte: minprice };
    if (maxprice) filter.price = { ...filter.price, $lte: maxprice };

    if (q) {
      const searchRegex = new RegExp(q, "i");
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const menuitems = await MenuModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalitems = await MenuModel.countDocuments(filter);
    const totalPages = Math.ceil(totalitems / limit);

    res.status(200).send({
      data: menuitems,
      extra: {
        currentPage: page,
        totalPages,
        totalitems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.newItemController = async (req, res) => {
  try {
    if (req.role !== "admin") throw new Error("You are not authorized");
    const payLoad = req.body;

    // check item
    const dish = await MenuModel.findOne({ name: payLoad.name });
    if (dish) throw new Error("dish exists with this name");

    const newDish = new MenuModel(payLoad);
    await newDish.save();

    res.status(200).send({ message: "new dish added" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.updateController = async (req, res) => {
  try {
    if (req.role !== "admin") throw new Error("You are not authorized");
    const _id = req.params.id;
    const payload = req.body;

    // check item
    const dish = await MenuModel.findOne({ _id });
    if (!dish) throw new Error("dish not found");

    await MenuModel.findOneAndUpdate({ _id }, payload);

    res.status(200).send({ message: "dish updated" });
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

exports.deleteController = async (req, res) => {
  try {
    if (req.role !== "admin") throw new Error("You are not authorized");
    const _id = req.params.id;

    // check item
    const dish = await MenuModel.findOne({ _id });
    if (!dish) throw new Error("dish not found");

    await MenuModel.findOneAndDelete({ _id });

    res.status(200).send({ message: "dish deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};
