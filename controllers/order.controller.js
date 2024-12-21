const { logger } = require("../middlewares/userLogger.middleware");
const { OrderModel } = require("../models/order.model");
const { UserModel } = require("../models/user.model");
const information = require("../resources/config.json");
const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(data) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.GoogleKey,
    },
  });

  transporter
    .sendMail({
      to: `${data.email}`,
      from: process.env.MAIL_SENDER,
      subject: data.subject,
      html: data.body,
    })
    .then(() => console.log("mail sent successfully"))
    .catch((err) => console.log("err", err));
}

function generateOrderHTML(order) {
  let total = order.totalprice;
  const restaurantDetails = information.restaurantDetails;

  const cartItemsHTML = order.items
    .map((item) => {
      const itemTotal = (item.quantity * (item.item.price * 0.8)).toFixed(2);
      return `
          <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e0e0e0;">
              <span>${item.item.name} (${item.quantity}x${(
        item.item.price * 0.8
      ).toFixed(2)})</span>
              <span>₹${itemTotal}</span>
          </li>`;
    })
    .join("");

  // Generate full order details HTML
  return `
      <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css"
        />
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
          }
          .order-details {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 30px;
            max-width: 600px;
            margin: 40px auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .order-details h2 {
            text-align: center;
            color: #007BFF;
            font-size: 28px;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .order-details h3 {
            color: #DC3545;
          }
          .order-details p {
            margin: 5px 0;
          }
          .order-details a {
            color: #007BFF;
            font-weight: bold;
            text-decoration: none;
            display: inline; /* Ensure links are inline, not block */
          }
          .order-details ul {
            padding: 0;
            list-style: none;
            margin: 0;
          }
          .order-details ul li {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            padding: 8px 0;
            border-bottom: 1px dashed #e0e0e0;
          }
          .order-details .total-price {
            font-size: 18px;
            color: #DC3545;
            font-weight: bold;
            text-align: right;
            margin-top: 15px;
          }
          .order-details .quick-links,
          .order-details .restaurant-details ul {
            display: flex;
            justify-content: space-between;
            padding: 0;
            list-style: none;
            margin-top: 5px;
          }
          .order-details .quick-links a,
          .order-details .restaurant-details ul a {
            margin-right: 15px;
          }
          .order-details .quick-links {
            margin-top: 10px;
            padding-bottom: 10px;
          }
          .order-details .restaurant-details {
            margin-top: 20px;
          }
          .order-details .restaurant-details h4 {
            color: #007BFF;
            font-size: 18px;
          }
          .order-details .footer {
            text-align: center;
            margin-top: 40px;
          }
          .order-details .footer p {
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="order-details">
          <h2>Order Placed</h2>
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <h3>Your Order Details</h3>
          </div>
          <p><strong>Customer Name:</strong> ${order.userName}</p>
          <p><strong>Customer Phone:</strong> <a href="tel:+91 ${
            order.userPhone
          }">${order.userPhone}</a></p>
          <p><strong>Delivery Address:</strong> ${order.userAddress}</p>
          ${
            order.userMail
              ? `<p><strong>Customer Email:</strong> <a href="mailto:${order.userMail}">${order.userMail}</a></p>`
              : ""
          }
          ${
            order.userMSG
              ? `<p><strong>Custom Message:</strong> ${order.userMSG}</p>`
              : ""
          }

          <div style="height: 1px; background-color: #e0e0e0; margin: 20px 0;"></div>
          
          <h3>Cart Items</h3>
          <ul>
            ${cartItemsHTML}
          </ul>

          <div class="total-price">
            <strong>Total Price: ₹${total?.toFixed(2)}</strong>
          </div>

          <!-- Separated Quick Links section -->
          <h4>Quick Links</h4>
          <div class="quick-links">
            <p><a href="https://satyanam.netlify.app/">Order More Food</a></p>
            <p><a href="https://satyanam.netlify.app/pages/profile.html">Track Your Order</a></p>
          </div>

          <div class="restaurant-details">
            <h4>Restaurant Details</h4>
            <p><strong><i class="fas fa-store" style="color: #007BFF;"></i> Name:</strong> ${
              restaurantDetails.name
            }</p>
            <p><strong><i class="fas fa-map-marker-alt" style="color: #007BFF;"></i> Address:</strong> ${
              restaurantDetails.address.line1
            }, ${restaurantDetails.address.city}, ${
    restaurantDetails.address.state
  } - ${restaurantDetails.address.zipcode}</p>
            <p><strong><i class="fas fa-phone-alt" style="color: #007BFF;"></i> Phone:</strong> <a href="tel:+91 ${
              restaurantDetails.contact.phone
            }">${restaurantDetails.contact.phone}</a></p>
            <p><strong><i class="fas fa-envelope" style="color: #007BFF;"></i> Email:</strong> <a href="mailto:${
              restaurantDetails.contact.email
            }">${restaurantDetails.contact.email}</a></p>
            <p><strong>Operating Hours:</strong></p>
            <ul>
              <li><strong>Weekdays:</strong> ${
                restaurantDetails.operatingHours.mondayToFriday
              }</li>
              <li><strong>Weekends:</strong> ${
                restaurantDetails.operatingHours.weekends
              }</li>
            </ul>
            <p><strong>Follow Us:</strong></p>
            <ul>
              <li><a href="${
                restaurantDetails.socialMedia.facebook
              }">Facebook</a></li>
              <li><a href="${
                restaurantDetails.socialMedia.instagram
              }">Instagram</a></li>
            </ul>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} ${
    restaurantDetails.name
  } - All Rights Reserved</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

exports.getOrder = async (req, res) => {
  try {
    const userID = req.userID;
    const user = await UserModel.findById(userID);
    const { userName, userPhone } = req.body;
    const { status } = req.query;

    let filter = {};

    if (userID) {
      filter.userID = userID;
    } else if (userName || userPhone) {
      filter.$or = [];
      if (userName) filter.$or.push({ userName: userName });
      if (userPhone) filter.$or.push({ userPhone: userPhone });
    } else {
      return res.status(400).send({
        message: "No orders yet",
      });
    }

    if (status) filter.status = status;

    const orders = await OrderModel.find(filter);
    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders yet" });
    }
    logger.info(
      `${user.name || userName} (${
        userPhone || user.phone
      }) looking for orders.`
    );
    res.status(200).send(orders);
  } catch (error) {
    logger.error(`Error showing orders: ${error.message}`);
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.newOrder = async (req, res) => {
  try {
    const { cart, userAddress, userMSG, userMail, userName, userPhone } =
      req.body;
    const status = "Pending";
    const userID = req.userID;

    let confirmOrder = {
      userName,
      userPhone,
      items: cart.items,
      totalprice: parseFloat(cart?.totalprice?.toFixed(2)),
      userAddress,
      status,
    };

    if (userID) confirmOrder.userID = userID;
    if (userMSG) confirmOrder.userMSG = userMSG;

    if (userMail) {
      confirmOrder.userMail = userMail;
      const htmlFormat = generateOrderHTML(confirmOrder);
      await sendEmail({
        email: userMail,
        subject: "New order!",
        body: htmlFormat,
      });
    }

    const order = new OrderModel(confirmOrder);
    await order.save();
    logger.info(`${userName} (${userPhone}) Placed new order.`);
    res.status(200).send({ data: order, message: "Order placed" });
  } catch (error) {
    logger.error(`Error processing order: ${error.message}`);
    console.error("Error processing order:", error.message);
    res.status(500).send({ message: error.message });
  }
};
