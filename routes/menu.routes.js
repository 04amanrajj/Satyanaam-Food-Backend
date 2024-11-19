const express = require("express");
const Router = require("express");
const {
  resetMenu,
  getMenuItem,
  deleteMenuItem,
  updateMenuItem,
  addMenuItem,
} = require("../controllers/menu.controller");
const { authenticate } = require("../middlewares/authorization.middleware");
const { checkBlacklist } = require("../middlewares/checkBlacklist.middleware");

const menuRoutes = Router();

// public route
menuRoutes.get("/", getMenuItem);

// middleware for protected routes
menuRoutes.use(authenticate);
menuRoutes.use(checkBlacklist);

// admin-only routes
menuRoutes.post("/reset", resetMenu); // reset menu
menuRoutes.post("/", addMenuItem); // add a menu item
menuRoutes.put("/:id", updateMenuItem); // update a menu item
menuRoutes.delete("/:id", deleteMenuItem); // delete a menu item

module.exports = { menuRoutes };
