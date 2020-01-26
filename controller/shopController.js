const express = require("express");
const router = express.Router();
const shopService = require("../services/shopService");

// 注册用户
router.get("/all", (req, res) => {
	shopService.getAll(req, res);
});

module.exports = router;
