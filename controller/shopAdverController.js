const express = require('express');

const router = express.Router();
const adverService = require('../services/shopAdverService');

// 查询广告图列表
router.get('/list', (req, res) => {
	adverService.getList(req, res);
});

module.exports = router;
