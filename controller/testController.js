const express = require('express');
const router = express.Router();
const testService = require('../services/testService');

// 测试打印机
router.get('/print', (req, res) => {
	testService.printOrder(req, res);
});

module.exports = router;
