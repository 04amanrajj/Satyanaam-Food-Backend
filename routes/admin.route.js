const express = require("express");
const Router = require("express");
const { authenticate } = require("../middlewares/authorization.middleware");
const { checkBlacklist } = require("../middlewares/checkBlacklist.middleware");
const {
  resetMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/admin.controller");

const adminRoute = Router();
adminRoute.use(express.json());

// protected routes
adminRoute.use(authenticate);
adminRoute.use(checkBlacklist);

// Menu-only routes
adminRoute.post("/menu/reset", resetMenu); // reset menu
adminRoute.post("/menu/", addMenuItem); // add a menu item
adminRoute.put("/menu/:id", updateMenuItem); // update a menu item
adminRoute.delete("/menu/:id", deleteMenuItem); // delete a menu item

// Order-only routes
adminRoute.put("/order/:id");

module.exports = { adminRoute };
