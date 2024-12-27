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
const { adminRoute } = require("./routes/admin.routes");
const { logger } = require("./middlewares/userLogger.middleware");
const { limiter } = require("./middlewares/rateLimit.middleware");
const cors = require("cors");
const { client } = require("./configs/redis");
const port = process.env.PORT || 4500;
require("dotenv").config();

const app = express();
app.use(cors());

app.set("trust proxy", 1); // Use '1' for one proxy, or 'true' to trust all proxies
app.use(limiter);

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
    client.on("error", (err) => {
      new Error("Redis Client Error:", err.message);
    });
    await client.connect();
    console.log("connected to DB");
    console.log("connected to Redis");
  } catch (error) {
    logger.error(`Server Error: ${error.message}`);
    console.log("failed to connect:", error.message);
  }
  console.log(`server running at http://localhost:${port}`);
});
