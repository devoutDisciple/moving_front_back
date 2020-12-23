const express = require('express');

const router = express.Router();
const optionsService = require('../services/optionsService');

// 新增用户意见
router.post('/add', (req, res) => {
	optionsService.add(req, res);
});

module.exports = router;
