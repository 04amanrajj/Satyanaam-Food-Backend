const redis = require("redis");
require("dotenv").config();

exports.client = redis.createClient({ url: process.env.REDIS_URI });
