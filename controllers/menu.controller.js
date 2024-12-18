const { logger } = require("../middlewares/userLogger.middleware");
const { MenuModel } = require("../models/menu.model");
const { UserModel } = require("../models/user.model");

exports.getMenuItem = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1000,
      category,
      minprice,
      maxprice,
      rating,
      q,
      price,
    } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (minprice) filter.price = { ...filter.price, $gte: minprice };
    if (maxprice) filter.price = { ...filter.price, $lte: maxprice };

    if (q) {
      const searchRegex = new RegExp(q, "i");
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    let sortOptions = {};
    if (price == 1) {
      sortOptions = { price: 1 };
    } else if (price == -1) {
      sortOptions = { price: -1 };
    }

    if (rating) {
      filter.rating = { $gte: rating };
    }

    const menuitems = await MenuModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);

    let user = { name: "Some one" };
    if (req.userID) {
      user = await UserModel.findById(req.userID);
    }

    const totalitems = await MenuModel.countDocuments(filter);
    const totalPages = Math.ceil(totalitems / limit);
    logger.info(`${user.name || "Some one"} visited menu.`);
    res.status(200).send({
      data: menuitems,
      metadata: {
        currentPage: +page,
        totalPages,
        totalitems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    logger.error(`Error showing menu: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const itemid = req.params.id;
    const item = await MenuModel.find({ _id: itemid });
    res.status(200).send({ data: item });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
