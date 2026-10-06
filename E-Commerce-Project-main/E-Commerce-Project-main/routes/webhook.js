const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook");

router.post(
    "/",
    express.raw({ type: "application/json" }),
    webhookController.webhookHandler,
);

module.exports = router;
