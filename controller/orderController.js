const express = require("express");
const router = express.Router();
const orderService = require("../services/orderService");
let shopService = require("../services/shopService");
let goodService = require("../services/goodsService");

// 增加订单
router.post("/add", async (req, res) => {
	let str = await orderService.addOrder(req, res);
	if(str == "success") {
		let goodsExe = await goodService.addSales(req, res);
		if(goodsExe) {
			await shopService.addSales(req, res);
		}
	}

});

// 获取订单通过openid  getList
router.get("/getListByOpenid", (req, res) => {
	orderService.getListByOpenid(req, res);
});

// 更改订单状态 updateOrderStatus
router.post("/updateOrderStatus", (req, res) => {
	orderService.updateOrderStatus(req, res);
});

// 通过订单id获取订单 getOrderById
router.get("/getOrderById", (req, res) => {
	orderService.getOrderById(req, res);
});


module.exports = router;
