const express = require('express');

const router = express.Router();
const billService = require('../services/billService');

// 获取所有区域
router.get('/getAllBillByUserid', (req, res) => {
	billService.getAllBillByUserid(req, res);
});

module.exports = router;
