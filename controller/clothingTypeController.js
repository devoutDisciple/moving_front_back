const express = require('express');

const router = express.Router();
const clothingTypeService = require('../services/clothingTypeService');

// 获取衣物分类 根据商店id
router.get('/getByShopid', (req, res) => {
	clothingTypeService.getByShopid(req, res);
});

module.exports = router;
