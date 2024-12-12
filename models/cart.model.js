const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userID: { type: String, required: false },
  userPhone: { type: Number, required: true },
  userName: { type: String, required: true },
  items: { type: Array, required: true },
  totalprice: { type: Number, required: true },
});

exports.CartModel = mongoose.model("cart_item", cartSchema);
