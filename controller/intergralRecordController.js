const express = require('express');
const router = express.Router();
const intergralRecordService = require('../services/intergralRecordService');

// 积分兑换商品
router.post('/add', (req, res) => {
	intergralRecordService.add(req, res);
});

module.exports = router;
