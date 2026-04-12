const express = require("express");
const router = express.Router();
const {register, login, logout, googleLogin} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login)
router.post("/logout", authMiddleware,  logout)


module.exports = router
