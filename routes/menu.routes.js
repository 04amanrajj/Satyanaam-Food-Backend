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
const { BlackListToken } = require("../models/blacklistTokens.model");

const menuRoutes = Router();
menuRoutes.use(express.json());

// get items
menuRoutes.get("/", getMenuItem);

menuRoutes.use(authenticate);
menuRoutes.use(BlackListToken);
// reset items
menuRoutes.post("/reset", resetMenu);

// add items
menuRoutes.post("/", addMenuItem);

// update item
menuRoutes.put("/:id", updateMenuItem);

// delete item
menuRoutes.delete("/:id", deleteMenuItem);
module.exports = { menuRoutes };
