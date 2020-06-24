const express = require('express');
const router = express.Router();
const testService = require('../services/testService');

// 测试打印机
router.get('/print', (req, res) => {
	testService.printOrder(req, res);
});

// 测试支付宝支付
router.get('/alipay', (req, res) => {
	testService.alipay(req, res);
});

module.exports = router;
