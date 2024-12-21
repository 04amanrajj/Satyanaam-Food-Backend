const winston = require("winston");
const path = require("path");
const { Log } = require("../models/logger.modal");

// Helper function to save log to DB
const saveLogToDB = async ({ level, message, timestamp }) => {
  const logEntry = new Log({ level, message, timestamp });
  await logEntry.save();
};

// Helper function to create level-specific transports
const createLevelTransport = (level, filename) =>
  new winston.transports.File({
    filename: path.join(__dirname, `../logs/${filename}`),
    level,
    format: winston.format.combine(
      winston.format.timestamp({
        format: () => {
          const now = new Date();
          // Use local time
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();

          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
      }),
      winston.format.printf(({ level, message, timestamp }) => {
        saveLogToDB({ level, message, timestamp });
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      }),
      winston.format((info) => (info.level === level ? info : false))() // Filter logs for specific level
    ),
  });

// Create logger instance with file and console transports
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => {
        const now = new Date();
        // Use local time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // File transports for each level
    createLevelTransport("info", "info.log"),
    createLevelTransport("warn", "warn.log"),
    createLevelTransport("error", "error.log"),

    // Console transport for Render logs
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Adds colors for easier readability
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      ),
    }),
  ],
});

module.exports = { logger };
