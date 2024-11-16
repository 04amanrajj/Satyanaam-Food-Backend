const express = require("express");
const { dbconnection } = require("./configs/db");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4500;

app.get("/", (req, res) => {
  res.status(200).send("homepage");
});

app.listen(port, async () => {
  try {
    await dbconnection;
    console.log("connected to DB");
  } catch (error) {
    console.log("failed to connect DB");
    console.log({ error: error.message });
  } 
  console.log(`server running at http://localhost:${port}`);
});
