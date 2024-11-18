const information = require("../resources/config.json");

const express = require("express");
const Router = require("express");

const defaultRoute = Router();
defaultRoute.use(express.json());

defaultRoute.get("/", async (req, res) => {
  try {
    res.send({ data: information });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = { defaultRoute };
