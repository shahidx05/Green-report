const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { loginUser, getMe } = require("../controllers/authController");

router.post("/login", loginUser);

router.get("/me", auth, getMe); 

module.exports = router;
