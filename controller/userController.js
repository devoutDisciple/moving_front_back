const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// 获取所有用户
router.get("/getAll", (req, res) => {
	userService.getAll(req, res);
});

module.exports = router;
