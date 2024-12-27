const { UserModel } = require("../models/user.model");
const { BlackListToken } = require("../models/blacklistTokens.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../middlewares/userLogger.middleware");

exports.userInfo = async (req, res) => {
  try {
    const userID = req.userID;
    const user = await UserModel.findById(userID);
    if (!user) return res.status(200).send({ message: "Logged in as guest" });
    logger.info(`${user.name} (${user.email}) visited profile.`);
    res.status(200).send({ message: user });
  } catch (error) {
    logger.error(`Error sending user details: ${error.message}`);
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.registerNewUser = async (req, res) => {
  try {
    const payLoad = req.body;

    // check for existing user
    const user = await UserModel.findOne({ email: payLoad.email });
    if (user)
      return res
        .status(409)
        .send({ message: "Email is invalid or already taken" });

    // encrypt pass
    const hashPass = await bcrypt.hash(payLoad.password, 10);
    payLoad.password = hashPass;
    const newUser = new UserModel(payLoad);
    await newUser.save();
    logger.info(
      `${user.name || payLoad.name} (${
        user.email || payLoad.email
      }) registered.`
    );
    res.status(200).send({ message: "User registered" });
  } catch (error) {
    logger.error(`Error creating new user: ${error.message}`);
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const payLoad = req.body;

    const query = {};

    if (payLoad.email) query.email = payLoad.email;
    else if (payLoad.phone) query.phone = payLoad.phone;

    // check for existing user
    const user = await UserModel.findOne(query).lean();
    if (!user)
      return res
        .status(404)
        .send({ message: "User not found with this Email" });

    // check pass
    const checkPassword = await bcrypt.compare(payLoad.password, user.password);
    if (!checkPassword)
      return res.status(400).send({ message: "Invalid credentials" });

    // genrate token
    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: Number(process.env.JWT_EXPIRES_IN) || "1h" }
    );
    delete user.password;
    logger.info(`${user.name || user.email || payLoad.email} logged in.`);
    res.status(200).send({ message: "User logged-in", token, user });
  } catch (error) {
    logger.error(`Error login user: ${error.message}`);
    console.log({ error: error.message });
    res.status(500).send({ message: error.message });
  }
};
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token)
      return res
        .status(400)
        .send({ message: "provide token in request headers" });

    // check if token exist in list
    const blackListed_Data = await BlackListToken.findOne({ token });
    if (blackListed_Data)
      return res.status(400).send({ message: "user is already logged out" });

    // save token to mongoDB
    await new BlackListToken({ token }).save();

    res.status(200).send({ message: "User logged out" });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ message: error.message });
  }
};
