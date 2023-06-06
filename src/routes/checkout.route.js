const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/checkout.controller");

//localhost:8000/reservation/create
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
