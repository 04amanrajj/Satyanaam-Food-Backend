const express = require("express");
const Router = require("express");
const { authenticate } = require("../middlewares/authorization.middleware");
const { checkBlacklist } = require("../middlewares/checkBlacklist.middleware");
const {
  resetMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateOrder,
  getOrders,
  users,
} = require("../controllers/admin.controller");

const adminRoute = Router();
adminRoute.use(express.json());

// protected routes
adminRoute.use(authenticate);
adminRoute.use(checkBlacklist);

// User-only routes
adminRoute.post("/user", users);

// Menu-only routes
adminRoute.post("/menu/reset", resetMenu); // reset menu
adminRoute.post("/menu", addMenuItem); // add a menu item
adminRoute.patch("/menu/:id", updateMenuItem); // update a menu item
adminRoute.delete("/menu/:id", deleteMenuItem); // delete a menu item

// Order-only routes
adminRoute.get("/order", getOrders);
adminRoute.patch("/order/:id", updateOrder);

module.exports = { adminRoute };
