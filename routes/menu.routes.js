const express = require("express");
const Router = require("express");
const { getMenuItem, getItemById } = require("../controllers/menu.controller");

const menuRoutes = Router();

// public route
menuRoutes.get("/", getMenuItem);
menuRoutes.get("/:id", getItemById);
module.exports = { menuRoutes };
