const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// 新增订单
router.post('/add', (req, res) => {
	orderService.add(req, res);
});

// 根据分页查询订单
router.get('/getOrderByPage', (req, res) => {
	orderService.getOrderByPage(req, res);
});

module.exports = router;
