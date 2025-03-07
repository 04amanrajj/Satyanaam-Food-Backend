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
app.listen(port, "0.0.0.0", async () => {
  try {
    await dbconnection;
    await client.connect();

    console.log("Connected to DB");
    console.log("Connected to Redis");

    // Handle Redis errors and try reconnecting
    client.on("error", async (err) => {
      console.error(`Redis Client Error: ${err.message}`);
      try {
        await client.connect();
        console.log("Reconnected to Redis");
      } catch (reconnectError) {
        console.error(`Redis Reconnection Failed: ${reconnectError.message}`);
      }
    });

    // Handle Redis disconnection
    client.on("end", async () => {
      console.warn("Redis Disconnected! Trying to reconnect...");
      try {
        await client.connect();
        console.log("Reconnected to Redis");
      } catch (reconnectError) {
        console.error(`Redis Reconnection Failed: ${reconnectError.message}`);
      }
    });
  } catch (error) {
    logger.error(`Server Error: ${error.message}`);
    console.error(`Failed to connect: ${error.message}`);
  }
  console.log(`Server running at http://localhost:${port}`);
});
