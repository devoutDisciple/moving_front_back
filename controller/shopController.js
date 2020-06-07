const express = require('express');
const router = express.Router();
const shopService = require('../services/shopService');

// 获取所有商店信息
router.get('/all', (req, res) => {
	shopService.getAll(req, res);
});

// 根据商店id获取商店信息
router.get('/getShopById', (req, res) => {
	shopService.getShopById(req, res);
});

module.exports = router;
