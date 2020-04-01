const express = require('express');
const router = express.Router();
const payService = require('../services/payService');

// 支付订单
router.post('/payOrder', (req, res) => {
	payService.payOrder(req, res);
});

module.exports = router;
