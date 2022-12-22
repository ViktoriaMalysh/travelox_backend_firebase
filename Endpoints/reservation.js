const express = require("express");
const router = express.Router();
const api = require("../Requests/Reservation");

//localhost:8000/reservation/create
router.post("/create", api.create);

module.exports = router;