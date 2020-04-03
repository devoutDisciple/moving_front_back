const express = require('express');
const router = express.Router();
const intergralService = require('../services/intergralService');

// 根据商店id获取积分商品
router.get('/getAllById', (req, res) => {
	intergralService.getAllById(req, res);
});

module.exports = router;
