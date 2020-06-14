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

// 根据订单id获取订单 getOrderById
router.get('/getOrderById', (req, res) => {
	orderService.getOrderById(req, res);
});

// 根据订单id 打开柜子 openCellById
router.post('/openCellById', (req, res) => {
	orderService.openCellById(req, res);
});

// 更改订单状态
router.post('/updateOrderStatus', (req, res) => {
	orderService.updateOrderStatus(req, res);
});

module.exports = router;
