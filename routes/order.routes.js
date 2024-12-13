const express = require("express");
const Router = require("express");

const { getOrder, newOrder } = require("../controllers/order.controller");

const orderRoute = Router();
orderRoute.use(express.json());

orderRoute.post("/", getOrder);
orderRoute.post("/new", newOrder);

module.exports = { orderRoute };
