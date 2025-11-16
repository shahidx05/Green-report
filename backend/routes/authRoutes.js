// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/authController");

// Public Route → Login (Admin + Worker use same login)
router.post("/login", loginUser);

module.exports = router;
