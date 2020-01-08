const express = require("express");
const router = express.Router();
const registerService = require("../services/registerService");

// 注册用户
router.post("/add", (req, res) => {
	registerService.register(req, res);
});

module.exports = router;
