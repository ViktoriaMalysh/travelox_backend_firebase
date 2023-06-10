const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  //   verifyToken,
} = require("../controllers/auth.controller");

//localhost:8000/sign-up
router.post("/sign-up", signUp);

//localhost:8000/sign-in
router.post("/sign-in", signIn);

//localhost:8000/verify-token
// router.post("/verify-token", verifyToken);

module.exports = router;
