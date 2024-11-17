const express = require("express");
const Router = require("express");

const {
  deleteCartItem,
  updateCartItem,
  getFromCart,
  addToCart,
} = require("../controllers/cart.controller");

const cartRoute = Router();
cartRoute.use(express.json());

cartRoute.get("/", getFromCart);

cartRoute.post("/", addToCart);

cartRoute.put("/:id", updateCartItem);

cartRoute.delete("/:id", deleteCartItem);

module.exports = { cartRoute };
