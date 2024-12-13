const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, required: false, default: true },
  rating: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
});

exports.MenuModel = mongoose.model("menu_item", menuSchema);
