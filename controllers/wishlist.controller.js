const { MenuModel } = require("../models/menu.model");
const { UserModel } = require("../models/user.model");

exports.wishlistController = async (req, res) => {
  try {
    const userID = req.userID;
    // find user
    const user = await UserModel.findOne({ _id: userID });
    // find items
    const items = await MenuModel.find({ _id: user.wishlist });
    res.status(200).send({ data: items });
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

exports.newWishController = async (req, res) => {
  try {
    const itemID = req.headers.itemid;
    const userID = req.userID;

    // check for duplicate items
    const user = await UserModel.findOne({ wishlist: itemID });
    if (user) throw new Error("item already in wishlist");

    // add item to user wishlist
    await UserModel.findOneAndUpdate(
      { _id: userID },
      { $push: { wishlist: itemID } }
    );
    res.send({ message: "item added to wishlist" });
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

exports.removeWishController = async (req, res) => {
  try {
    const itemID = req.params.id;
    const userID = req.userID;

    // check for duplicate items
    const user = await UserModel.findOne({ wishlist: itemID });
    if (!user) throw new Error("item not found");

    // pull/remove item to user wishlist
    await UserModel.findOneAndUpdate(
      { _id: userID },
      { $pull: { wishlist: itemID } }
    );
    res.send({ message: "item removed from wishlist" });
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};
