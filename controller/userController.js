const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// 根据token获取当前用户信息
router.get("/getUserByToken", (req, res) => {
	userService.getUserByToken(req, res);
});

module.exports = router;
