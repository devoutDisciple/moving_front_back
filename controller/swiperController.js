const express = require("express");
const router = express.Router();
const swiperService = require("../services/swiperService");

// 获取所有轮播图的list /swiper/all
router.get("/all", (req, res) => {
	swiperService.getAll(req, res);
});

module.exports = router;
