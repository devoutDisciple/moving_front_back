const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// 通过洗衣柜下单
router.post('/addByCabinet', (req, res) => {
	orderService.addByCabinet(req, res);
});

// 预约上门取衣
router.post('/addByHome', (req, res) => {
	orderService.addByHome(req, res);
});

// 增加积分订单 addByIntergral
router.post('/addByIntergral', (req, res) => {
	orderService.addByIntergral(req, res);
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

// 预约上门取衣扣除费用 subMoneyByAccount
router.post('/subMoneyByAccount', (req, res) => {
	orderService.subMoneyByAccount(req, res);
});

// 更改订单状态
router.post('/updateOrderStatus', (req, res) => {
	orderService.updateOrderStatus(req, res);
});

module.exports = router;
