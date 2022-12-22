const express = require("express");
const router = express.Router();
const user = require("../Requests/User");

//localhost:8000/sign-up
router.post("/sign-up", user.signUp);

//localhost:8000/sign-in
router.post("/sign-in", user.signIn);

//localhost:8000/verify-token
router.post("/verify-token", user.verifyToken);

module.exports = router;
