const express = require("express");
const Router = require("express");
const { limiter } = require("../middlewares/rateLimit.middleware");
const userRoute = Router();
const {
  registerNewUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller");
require("dotenv").config();

userRoute.use(express.json());
userRoute.use(limiter);

userRoute.post("/register", registerNewUser);

userRoute.post("/login", loginUser);

userRoute.post("/logout", logoutUser);
module.exports = { userRoute };
