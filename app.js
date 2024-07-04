const express = require("express");

const ResponseHandler = require("./lib/generic/response/response_handler");

const app = express();
const port = 3000;
const baseServer = "/api/";

// Define routes to forward requests to appropriate microservices

// User Service
const userRouter = require("./lib/routes/users/user_service").user;
app.use(baseServer + "user", userRouter);

// Product Service
const productRouter = require("./lib/routes/products/product_service").product;
app.use(baseServer + "product", productRouter);

// Order Service
const orderRouter = require("./lib/routes/orders/order_service").order;
app.use(baseServer + "order", orderRouter);

// Category Service
const categoryRouter =
  require("./lib/routes/category/category_service").category;
app.use(baseServer + "category", categoryRouter);

// Loyalty Points Service
const loyaltyRouter = require("./lib/routes/loyalty/loyalty_service").loyalty;
app.use(baseServer + "loyalty", loyaltyRouter);

// Vendor Service
const vendorRouter = require("./lib/routes/vendor/vendor_service").vendor;
app.use(baseServer + "vendor", vendorRouter);

// Cart Service
const cartRouter = require("./lib/routes/cart/cart_service").cart;
app.use(baseServer + "cart", cartRouter);

app.listen(port, () => {
  console.log(`API Gateway is running at http://localhost:${port}`);
});

app.get("/server-status", (req, res) => {
  // Server connected successfully
  const responseHandler = new ResponseHandler();

  // Set response properties
  responseHandler
    .setSuccess(true)
    .setMessage("Operation successful")
    .setData({ serverConnectionStatus: true });

  // Get the final result
  const result = responseHandler.getResult();
  console.log(result);
  res.json(result);
});
