const express = require('express');
const router = express.Router();
const alipayService = require('../services/alipayService');

// 处理支付宝支付返回接口
router.post('/handleOrder', (req, res) => {
	alipayService.handleOrder(req, res);
});

module.exports = router;
