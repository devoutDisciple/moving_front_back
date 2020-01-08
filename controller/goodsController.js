const express = require("express");
const router = express.Router();
const goodsService = require("../services/goodsService");

// 根据商店id获取商品
router.get("/getByShopId", (req, res) => {
	goodsService.getByShopId(req, res);
});

// 根据校园获取商品
router.get("/getByCampus", (req, res) => {
	goodsService.getByCampus(req, res);
});

// 根据商品id获取商品详情
router.get("/getById", (req, res) => {
	goodsService.getById(req, res);
});

// 指定id的商品增加销量
router.post("/addSales", (req, res) => {
	goodsService.addSales(req, res);
});

// 获取今日推荐
router.get("/getToday", (req, res) => {
	goodsService.getToday(req, res);
});

// 根据名称获取类似商品 getGoodsByLikeName
router.get("/getGoodsByLikeName", (req, res) => {
	goodsService.getGoodsByLikeName(req, res);
});

module.exports = router;
