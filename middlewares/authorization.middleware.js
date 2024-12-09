const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      req.role = "Guest";
      next();
      return; // res.status(403).send({ message: "logged in as guest" });
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
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .send({ message: "Token expired. Please log in again." });
    }
    console.log({ error: error.message });
    res.status(500).send({ message: error.message });
  }
};
