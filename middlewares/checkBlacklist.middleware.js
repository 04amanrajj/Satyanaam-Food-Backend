const { BlackListToken } = require("../models/blacklistTokens.model");

exports.checkBlacklist = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      next();
      // res.status(200).send("logged in as guest");
      return;
    }

    const blacklisted = await BlackListToken.findOne({ token });
    if (blacklisted)
      return res
        .status(401)
        .send({ message: "User has been logged successfully" });

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
