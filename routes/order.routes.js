const express = require("express");
const Router = require("express");

const { getOrder, newOrder } = require("../controllers/order.controller");

const orderRoute = Router();
orderRoute.use(express.json());

orderRoute.get("/", getOrder);
orderRoute.post("/", newOrder);

module.exports = { orderRoute };
