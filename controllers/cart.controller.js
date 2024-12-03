const { MenuModel } = require("../models/menu.model");
const { CartModel } = require("../models/cart.model");
const { UserModel } = require("../models/user.model");

exports.getFromCart = async (req, res) => {
  try {
    const userID = req.userID;
    // find cart
    const cart = await CartModel.findOne({ userID });
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    res.status(200).send({ data: cart });
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { itemid, quantity } = req.body;
    const userID = req.userID;

    if (!itemid || !quantity || quantity <= 0) {
      return res.status(400).send({ message: "Invalid itemid or quantity" });
    }
    const item = await MenuModel.findOne({ _id: itemid });
    if (!item) return res.status(404).send({ message: "Item not found" });

    const totalprice = item.price * quantity;

    // check for duplicate items
    const itemExists = await CartModel.findOne({ userID });
    if (itemExists)
      if (itemExists.items.some((item) => item.item._id == itemid))
        return res.status(400).send({ message: "item already in cart" });

    // add/update item to cart
    const cart = await CartModel.findOneAndUpdate(
      { userID },
      {
        $push: { items: { item, quantity } },
        $inc: { totalprice: totalprice },
      },
      { upsert: true }
    );

    // pull/remove item to user wishlist
    await UserModel.findOneAndUpdate(
      { _id: userID },
      { $pull: { wishlist: itemid } }
    );

    res.status(200).send({ message: "item added to cart" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userID = req.userID;
    const itemid = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .send({ message: "Quantity must be greater than 0" });
    }
    // Validate the menu item
    const item = await MenuModel.findOne({ _id: itemid });
    if (!item) return res.status(404).send({ message: "Item not found" });

    // Find the cart
    const cart = await CartModel.findOne({ userID });
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    // find and update quantity
    const currentItem = cart.items.find((i) => i.item._id == itemid);
    if (!currentItem)
      return res.status(404).send({ message: "Item not found in cart" });

    const quantityDiffrance = quantity - currentItem.quantity;
    const priceDiffrance = item.price * quantityDiffrance;

    // update item's quantity & price
    await CartModel.findOneAndUpdate(
      { userID, "items.item._id": itemid },
      {
        $set: { "items.$.quantity": quantity }, // Update quantity
        $inc: { totalprice: priceDiffrance }, // Adjust total price
      }
    );

    res.status(200).send({ message: "item's quantity updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const itemid = req.params.id;
    const userID = req.userID;

    // Find the cart
    const cart = await CartModel.findOne({ userID });
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    // find item to remove
    const cartItem = cart.items.find((i) => i.item._id == itemid);
    if (!cartItem)
      return res.status(404).send({ message: "Item not found in cart" });

    // recalculate price
    console.log(item);
    const priceDiffrance = cartItem.quantity * cartItem.item.price;

    await CartModel.findOneAndUpdate(
      { userID },
      {
        $pull: { items: { "item._id": itemid } },
        $inc: { totalprice: -priceDiffrance },
      }
    );
    res.status(200).send({ message: "item removed from cart" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
