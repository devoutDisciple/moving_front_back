const express = require('express');
const router = express.Router();
const cabinetService = require('../services/cabinetService');

// 获取快递柜 根据商店id
router.get('/getAllByShop', (req, res) => {
	cabinetService.getAllByShop(req, res);
});

// 打开柜子
router.post('/openCellSave', (req, res) => {
	cabinetService.openCellSave(req, res);
});

// 获取柜子状态
router.get('/getStateById', (req, res) => {
	cabinetService.getStateById(req, res);
});

// 获取柜子详细信息 getDetailById
router.get('/getDetailById', (req, res) => {
	cabinetService.getDetailById(req, res);
});

module.exports = router;
