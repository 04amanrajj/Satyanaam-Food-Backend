const { MenuModel } = require("../models/menu.model");
const { UserModel } = require("../models/user.model");

exports.wishlistController = async (req, res) => {
  try {
    const userID = req.userID;
    // find user
    const user = await UserModel.findOne({ _id: userID });
    if (!user) return res.status(404).send({ message: "User not found" });
    // find items
    const items = await MenuModel.find({ _id: user.wishlist });
    res.status(200).send({ data: items });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.newWishController = async (req, res) => {
  try {
    const itemID = req.body.itemid;
    const userID = req.userID;

    // check for item & duplicate items
    const item = await MenuModel.findOne({ _id: itemID });
    if (!item) return res.status(404).send({ message: "Item not found" });

    const user = await UserModel.findOne({ _id: userID });
    if (user.wishlist.includes(itemID)) {
      return res.status(400).send({ message: "Item already in wishlist" });
    }
    // add item to user wishlist
    user.wishlist.push(itemID);
    await user.save();

    res.status(200).send({ message: "item added to wishlist" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.removeWishController = async (req, res) => {
  try {
    const itemID = req.params.id;
    const userID = req.userID;

    // check for duplicate items
    const user = await UserModel.findOne({ _id: userID });
    if (!user) return res.status(404).send({ message: "User not found" });

    if (!user.wishlist.includes(itemID))
      return res.status(404).send({ message: "Item not found in wishlist" });

    // pull/remove item to user wishlist
    user.wishlist = user.wishlist.filter((item) => item.toString() !== itemID);
    await user.save();

    res.send({ message: "item removed from wishlist" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
