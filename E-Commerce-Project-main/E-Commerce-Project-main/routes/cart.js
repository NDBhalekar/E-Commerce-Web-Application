const express = require("express");
const router = express.Router({ mergeParams: true });
const cartController = require("../controllers/cart.js");
const { isLoggedIn } = require("../middlewares");

router.route("/").get(isLoggedIn, cartController.getCart);

router
    .route("/:id")
    .post(isLoggedIn, cartController.addToCart)
    .delete(isLoggedIn, cartController.removeFromCart);

module.exports = router;
