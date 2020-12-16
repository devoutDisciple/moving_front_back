const express = require('express');

const router = express.Router();
const clothingService = require('../services/clothingService');

// 获取衣物 根据商店id
router.get('/getByShopid', (req, res) => {
	clothingService.getByShopid(req, res);
});

module.exports = router;
