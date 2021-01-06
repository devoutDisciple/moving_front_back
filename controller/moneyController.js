const express = require('express');

const router = express.Router();
const MoneyService = require('../services/moneyService');

// 获取所有支付金额种类
router.get('/getAllType', (req, res) => {
	MoneyService.getAllType(req, res);
});

module.exports = router;
