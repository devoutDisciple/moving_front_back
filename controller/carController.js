const express = require("express");
const router = express.Router();
const carService = require("../services/carService");

// 根据用户id获取购物车信息
router.get("/getByOpenid", (req, res) => {
	carService.getByOpenid(req, res);
});

// 加入购物车
router.post("/addCarGoods", (req, res) => {
	carService.addCarGoods(req, res);
});

// 更改购物车数量 modifyNum
router.post("/modifyNum", (req, res) => {
	carService.modifyNum(req, res);
});

// 删除购物车  onDeleteCar
router.post("/delteItem", (req, res) => {
	carService.delteItem(req, res);
});

// 获取购物车数量通过openid getCarNumByOpenid
router.get("/getCarNumByOpenid", (req, res) => {
	carService.getCarNumByOpenid(req, res);
});

// 批量删除 deleteMany
router.post("/deleteMany", (req, res) => {
	carService.deleteMany(req, res);
});


module.exports = router;
