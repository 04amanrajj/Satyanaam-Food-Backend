const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).send({ message: "login first" });
    }
    // verify token for authentication
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(403).send({ message: "please login" });
    }
    req.userID = decoded.userID;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ message: error.message });
  }
};