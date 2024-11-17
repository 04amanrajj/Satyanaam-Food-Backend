const express = require("express");
const Router = require("express");

const {
  getOrder,
  newOrder,
  updateOrder,
} = require("../controllers/order.controller");

const orderRoute = Router();
orderRoute.use(express.json());

orderRoute.get("/", getOrder);

orderRoute.post("/", newOrder);

orderRoute.put("/:id", updateOrder);

module.exports = { orderRoute };
