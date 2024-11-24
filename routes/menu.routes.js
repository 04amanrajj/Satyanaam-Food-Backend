const express = require("express");
const Router = require("express");
const { getMenuItem } = require("../controllers/menu.controller");

const menuRoutes = Router();

// public route
menuRoutes.get("/", getMenuItem);

module.exports = { menuRoutes };
