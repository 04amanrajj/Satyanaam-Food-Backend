const express = require("express");
const { dbconnection } = require("./configs/db");
const { userRoute } = require("./routes/user.routes");
const { menuRoutes } = require("./routes/menu.routes");
const { authenticate } = require("./middlewares/authorization.middleware");
const { wishlistRoute } = require("./routes/wishlist.routes");
const { cartRoute } = require("./routes/cart.routes");
const { orderRoute } = require("./routes/order.routes");
const { defaultRoute } = require("./routes/default.routes");
const { checkBlacklist } = require("./middlewares/checkBlacklist.middleware");
const cors = require("cors");
const { adminRoute } = require("./routes/admin.route");
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 4500;

// public routes
app.use("/", defaultRoute);
app.use("/user", userRoute);

// partially protected routes
app.use("/menu", menuRoutes);

// protected routes
app.use(authenticate);
app.use(checkBlacklist);
app.use("/wishlist", wishlistRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

// admin
app.use("/admin", adminRoute);

// server initialization
app.listen(port, async () => {
  try {
    await dbconnection;
    console.log("connected to DB");
  } catch (error) {
    console.log("failed to connect DB:", error.message);
  }
  console.log(`server running at http://localhost:${port}`);
});
