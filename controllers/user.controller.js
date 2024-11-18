const { UserModel } = require("../models/user.model");
const { BlackListToken } = require("../models/blacklistTokens.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
exports.registerNewUser = async (req, res) => {
  try {
    const payLoad = req.body;

    // check for existing user
    const user = await UserModel.findOne({ email: payLoad.email });
    if (user) {
      throw new Error("Email is invalid or already taken ");
    }

    // encrypt pass
    const hashPass = await bcrypt.hash(payLoad.password, 10);
    payLoad.password = hashPass;
    const newUser = new UserModel(payLoad);
    await newUser.save();

    res.status(200).send({ message: "User registered" });
  } catch (error) {
    console.log({ error: error.message });
    res.status(400).send({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const payLoad = req.body;

    // check for existing user
    const user = await UserModel.findOne({ email: payLoad.email }).lean(); //lean return js plain obj
    if (!user) throw new Error("User not found with this Email");

    // check pass
    const checkPassword = await bcrypt.compare(payLoad.password, user.password);
    if (!checkPassword) throw new Error("Wrong password");

    // genrate token
    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    delete user.password; //issue not removing pass
    res.status(200).send({ message: "User logged-in", token, user });
  } catch (error) {
    console.log({ error: error.message });
    res.status(401).send({ message: error.message });
  }
};
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) throw new Error("provide token in request headers");

    // check if token exist in list
    const blackListed_Data = await BlackListToken.findOne({ token });
    if (blackListed_Data) throw new Error("user is already logged out");

    // save token to mongoDB
    await new BlackListToken({ token }).save();

    res.status(200).send({ message: "user logged out" });
  } catch (error) {
    console.log({ error: error.message });
    res.status(401).send({ message: error.message });
  }
};
