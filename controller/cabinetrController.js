const express = require('express');
const router = express.Router();
const cabinetService = require('../services/cabinetService');

// 获取快递柜 根据商店id
router.get('/getAllByShop', (req, res) => {
	cabinetService.getAllByShop(req, res);
});

module.exports = router;
