const express = require("express");
const Router = require("express");

const {
  wishlistController,
  removeWishController,
  newWishController,
} = require("../controllers/wishlist.controller");

const wishlistRoute = Router();
wishlistRoute.use(express.json());

wishlistRoute.get("/", wishlistController);

wishlistRoute.post("/", newWishController);

wishlistRoute.delete("/:id", removeWishController);

module.exports = { wishlistRoute };
