const express = require("express");
const Router = require("express");
const {
  resetController,
  getItemsControllers,
  deleteController,
  updateController,
  newItemController,
} = require("../controllers/menu.controller");

const menuRoutes = Router();
menuRoutes.use(express.json());

// reset items
menuRoutes.post("/reset", resetController);

// get items
menuRoutes.get("/", getItemsControllers);

// add items
menuRoutes.post("/", newItemController);

// update item
menuRoutes.patch("/:id", updateController);

// delete item
menuRoutes.delete("/:id", deleteController);
module.exports = { menuRoutes };
