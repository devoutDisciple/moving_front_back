const express = require('express');

const router = express.Router();
const xmlparser = require('express-xml-bodyparser'); // 引入
const payResultService = require('../services/payResultService');

// 处理支付宝支付返回接口
router.post('/handleAlipy', (req, res) => {
	payResultService.handleAlipy(req, res);
});

// 处理微信支付返回接口
router.post('/handleWechat', xmlparser({ trim: false, explicitArray: false }), (req, res) => {
	payResultService.handleWechat(req, res);
});

module.exports = router;
