const express = require("express");
const router = express.Router();
const swiperService = require("../services/swiperService");

// 根据商店id获取轮播图
router.get("/getAllById", (req, res) => {
	swiperService.getAllById(req, res);
});

module.exports = router;
