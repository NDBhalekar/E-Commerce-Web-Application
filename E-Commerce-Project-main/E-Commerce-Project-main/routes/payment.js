const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.js");
const { isLoggedIn } = require("../middlewares");

router.post("/checkout", isLoggedIn, paymentController.checkout);
router.post("/buy-now/:id", isLoggedIn, paymentController.buyNow);

module.exports = router;
