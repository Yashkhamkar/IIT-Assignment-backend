const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { register, login } = require("../controllers/authControllers");

const router = express.Router();

// router.route("/").get(protect, getall)
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
