const express = require('express');
const router = express.Router();
const payService = require('../services/payService');

// 使用微信支付订单
router.post('/payOrderByWechat', (req, res) => {
	payService.payOrderByWechat(req, res);
});

// 通过支付宝支付订单
router.post('/payByOrderAlipay', (req, res) => {
	payService.payByOrderAlipay(req, res);
});

// 通过余额支付 payByOrderByBalance
router.post('/payByOrderByBalance', (req, res) => {
	payService.payByOrderByBalance(req, res);
});

module.exports = router;
