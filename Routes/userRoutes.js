const express = require("express");
const validateToken = require("../Middleware/validateToken");
const { signupUser, loginUser } = require("../Controllers/userControllers");

const router = express.Router();
router.route("/signup").post(
  signupUser
);
router.route("/login").post(
  loginUser
)

module.exports = router;
