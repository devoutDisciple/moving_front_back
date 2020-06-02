const express = require('express');
const router = express.Router();
const intergralGoodsService = require('../services/intergralGoodsService');

// 根据商店id获取积分商品
router.get('/getAllById', (req, res) => {
	intergralGoodsService.getAllById(req, res);
});

module.exports = router;
