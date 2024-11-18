const { MenuModel } = require("../models/menu.model");
const { CartModel } = require("../models/cart.model");
const { UserModel } = require("../models/user.model");

exports.getFromCart = async (req, res) => {
  try {
    const userID = req.userID;
    // find cart
    const cart = await CartModel.findOne({ userID });
    if (!cart) throw new Error("Cart not found");

    // find items
    let items = [];
    for (const element of cart.items) {
      items.push(await MenuModel.findOne({ _id: element.itemid }));
    }

    res.status(200).send({ data: cart, items });
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
    if (!item) throw new Error("Item not found");

    const totalprice = item.price * quantity;

    // check for duplicate items
    const itemExists = await CartModel.findOne({ userID });
    if (itemExists)
      if (itemExists.items.some((item) => item.itemid == itemid))
        throw new Error("item already in cart");

    // add/update item to cart
    const cart = await CartModel.findOneAndUpdate(
      { userID },
      {
        $push: { items: { itemid, quantity } },
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
    if (!item) throw new Error("Item not found");

    // Find the cart
    const cart = await CartModel.findOne({ userID });
    if (!cart) throw new Error("Cart not found");

    // find and update quantity
    const currentItem = cart.items.find((i) => i.itemid == itemid);
    if (!currentItem) throw new Error("Item not found in cart");

    const quantityDiffrance = quantity - currentItem.quantity;
    const priceDiffrance = item.price * quantityDiffrance;

    // update item's quantity & price
    await CartModel.findOneAndUpdate(
      { userID, "items.itemid": itemid },
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
    if (!cart) throw new Error("Cart not found");

    // find item to remove
    const itemToRemove = cart.items.find((i) => i.itemid == itemid);
    if (!itemToRemove) throw new Error("Item not found in cart");

    // find item price
    const item = await MenuModel.findOne({ itemid: itemToRemove.itemid });
    // recalculate price
    const priceDiffrance = itemToRemove.quantity * item.price;
    const updateCart = await CartModel.findOneAndUpdate(
      { userID },
      {
        $pull: { items: { itemid: itemid } },
        $inc: { totalprice: -priceDiffrance },
      }
    );
    if (!updateCart) throw new Error("failed to remove item from cart");
    res.status(200).send({ message: "item removed from cart" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
