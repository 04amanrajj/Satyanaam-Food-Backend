const winston = require("winston");
const path = require("path");

// Helper function to create level-specific transports
const createLevelTransport = (level, filename) =>
  new winston.transports.File({
    filename: path.join(__dirname, `../logs/${filename}`),
    level,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      }),
      winston.format((info) => (info.level === level ? info : false))() // Filter logs for specific level
    ),
  });

// Create logger instance with level-specific transports
const logger = winston.createLogger({
  transports: [
    createLevelTransport("info", "info.log"),
    createLevelTransport("warn", "warn.log"),
    createLevelTransport("error", "error.log"),
  ],
});

module.exports = { logger };
