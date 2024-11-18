const { BlackListToken } = require("../models/blacklistTokens.model");

exports.checkBlacklist = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error("Please login first!");

    const blacklisted = await BlackListToken.findOne({ token });
    if (blacklisted) throw new Error("token is blacklisted");

    next();
  } catch (error) {
    res.status(400), send({ message: error.message });
  }
};
