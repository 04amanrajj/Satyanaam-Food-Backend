const express = require("express");
const Router = require("express");

const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/user.controller");
const userRoute = Router();
require("dotenv").config();

userRoute.use(express.json());

userRoute.post("/register", registerController);

userRoute.post("/login", loginController);

userRoute.get("/logout", logoutController);
module.exports = { userRoute };
