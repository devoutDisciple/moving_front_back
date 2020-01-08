const express = require("express");
const router = express.Router();
const shopService = require("../services/shopService");

// 获取所有商店信息
router.get("/all", (req, res) => {
	shopService.getAll(req, res);
});
// 根据商店id获取商店
router.get("/getById", (req, res) => {
	shopService.getById(req, res);
});
// 根据分类获取商店
router.get("/getShopByType", (req, res) => {
	shopService.getShopByType(req, res);
});
// 模糊搜索商店
router.get("/getShopByName", (req, res) => {
	shopService.getShopByName(req, res);
});

module.exports = router;
