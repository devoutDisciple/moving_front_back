const express = require('express');
const router = express.Router();
const intergralRecordService = require('../services/intergralRecordService');

// 积分兑换商品
router.post('/add', (req, res) => {
	intergralRecordService.add(req, res);
});

// 根据用户id获取所有兑换记录 getRecordByUserid
router.get('/getRecordByUserid', (req, res) => {
	intergralRecordService.getRecordByUserid(req, res);
});

module.exports = router;
