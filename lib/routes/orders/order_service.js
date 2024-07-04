const express = require("express");

var order = express.Router();

// Define order-related routes
order.get("/", (req, res) => {
  // Get all orders logic
});

order.post("/", (req, res) => {
  // Create a new order logic
});

module.exports.order = order;
