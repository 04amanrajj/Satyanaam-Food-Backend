const mongoose = require("mongoose");
require("dotenv").config();

exports.dbconnection = mongoose.connect(process.env.MONGO_URI);
