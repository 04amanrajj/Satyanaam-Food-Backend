const express = require("express");
const Router = require("express");
const { limiter } = require("../middlewares/rateLimit.middleware");
const { authenticate } = require("../middlewares/authorization.middleware");
const userRoute = Router();
const {
  registerNewUser,
  loginUser,
  logoutUser,
  userInfo,
} = require("../controllers/user.controller");
require("dotenv").config();

userRoute.use(express.json());
userRoute.use(limiter);

userRoute.get("/",authenticate,userInfo)

userRoute.post("/register", registerNewUser);

userRoute.post("/login", loginUser);

userRoute.post("/logout", logoutUser);
module.exports = { userRoute };
