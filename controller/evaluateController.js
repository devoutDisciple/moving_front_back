const express = require("express");
const router = express.Router();
const evaluateService = require("../services/evaluateService");
const orderService = require("../services/orderService");

// 新增评价
router.post("/addEvaluate", async (req, res) => {
	let result = await evaluateService.addEvaluate(req, res);
	if(result == "success") {
		await orderService.updateStatus(req, res, {
			status: 5,
			orderid: req.body.orderid
		});
	}
});
// 根据商店id获取评价
router.get("/getEvaluateByGoodsId", (req, res) => {
	evaluateService.getEvaluateByGoodsId(req, res);
});

module.exports = router;
