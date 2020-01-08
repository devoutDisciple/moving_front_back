const express = require("express");
const router = express.Router();
const adverService = require("../services/adverService");

// 获取广告图
router.get("/getAll", (req, res) => {
	adverService.getAll(req, res);
});

module.exports = router;
