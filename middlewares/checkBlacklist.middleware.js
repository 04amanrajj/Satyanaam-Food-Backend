const { BlackListToken } = require("../models/blacklistTokens.model");

exports.checkBlacklist = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send("Please login first!");

    const blacklisted = await BlackListToken.findOne({ token });
    if (blacklisted)
      return res.status(401).send({ message: "token is blacklisted" });

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
