const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: { type: String, required: true }, // Log level (info, error, warn, etc.)
    message: { type: String, required: true }, // Log message
    timestamp: { type: String, require: false }, // Timestamp of the log
  },
  { collection: "logs" } // Specify collection name
);

exports.Log = mongoose.model("log", logSchema);
