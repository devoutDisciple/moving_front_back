const express = require('express');
const router = express.Router();
const areaService = require('../services/AreaService');

// 获取所有区域
router.get('/getAll', (req, res) => {
	areaService.getAll(req, res);
});

module.exports = router;
