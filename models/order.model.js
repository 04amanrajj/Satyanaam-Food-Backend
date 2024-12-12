const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userID: { type: String, required: false },
  userPhone: { type: Number, required: true },
  userName: { type: String, required: true },
  items: { type: Array, required: true },
  totalprice: { type: Number, required: true },
  status: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

exports.OrderModel = mongoose.model("order", orderSchema);
