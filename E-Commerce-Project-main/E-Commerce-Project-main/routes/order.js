const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares");
const orderController = require("../controllers/orders");

router.get("/", isLoggedIn, orderController.index);

module.exports = router;
