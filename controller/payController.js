const express = require("express");
const router = express.Router();
const payService = require("../services/payService");

router.get("/order", (req, res) => {
	payService.payOrder(req, res);
});

// 申请退款 getBackPayMoney
router.post("/getBackPayMoney", (req, res) => {
	payService.getBackPayMoney(req, res);
});

// 申请退款，改变订单状态为退款中 getBackMoneyStatus
router.post("/getBackMoneyStatus", (req, res) => {
	payService.getBackMoneyStatus(req, res);
});

module.exports = router;
