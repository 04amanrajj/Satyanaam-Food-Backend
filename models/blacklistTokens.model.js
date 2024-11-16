const mongoose = require("mongoose");

const blacklistToken = mongoose.Schema({
  token: String,
},{ versionKey: false });

const BlackListToken = mongoose.model("blackListedToken", blacklistToken);

module.exports = { BlackListToken };
