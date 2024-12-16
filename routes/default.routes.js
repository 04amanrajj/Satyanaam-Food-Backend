const information = require("../resources/config.json");

const express = require("express");
const Router = require("express");
const { logger } = require("../middlewares/userLogger.middleware");

const defaultRoute = Router();
defaultRoute.use(express.json());

defaultRoute.get("/", async (req, res) => {
  try {
    res.send({ data: information });
  } catch (error) {
    logger.error(`Error showing info: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = { defaultRoute };
