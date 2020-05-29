const express = require('express');
const router = express.Router();
const cabinetService = require('../services/cabinetService');

// 获取快递柜 根据商店id
router.get('/getAllByShop', (req, res) => {
	cabinetService.getAllByShop(req, res);
});

// 打开柜子
router.post('/open', (req, res) => {
	cabinetService.open(req, res);
});

// 获取柜子状态
router.get('/getStateById', (req, res) => {
	cabinetService.getStateById(req, res);
});

module.exports = router;