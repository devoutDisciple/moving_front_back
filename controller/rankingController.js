const express = require('express');

const router = express.Router();
const rankingService = require('../services/rankingService');

// 获取排行榜数据
router.get('/getRankingByType', (req, res) => {
	rankingService.getRankingByType(req, res);
});

module.exports = router;
