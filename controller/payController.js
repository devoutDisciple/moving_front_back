const express = require('express');
const router = express.Router();
const payService = require('../services/payService');

// 支付订单
router.post('/payOrder', (req, res) => {
	payService.payOrder(req, res);
});

// 通过支付宝支付订单
router.post('/payByOrderAlipay', (req, res) => {
	payService.payByOrderAlipay(req, res);
});

// 获取支付宝异步通知结果 getAlipayResult
router.post('/getAlipayResult', (req, res) => {
	payService.getAlipayResult(req, res);
});

module.exports = router;
