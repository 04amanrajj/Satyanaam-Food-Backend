const express = require("express");
const { dbconnection } = require("./configs/db");
const { userRoute } = require("./routes/user.routes");
const { menuRoutes } = require("./routes/menu.routes");
const { authenticate } = require("./middlewares/authorization.middleware");
const { wishlistRoute } = require("./routes/wishlist.routes");
const { cartRoute } = require("./routes/cart.routes");
const { orderRoute } = require("./routes/order.routes");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4500;

app.use("/user", userRoute);
app.use(authenticate);
app.use("/menu", menuRoutes);
app.use("/wishlist", wishlistRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

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
