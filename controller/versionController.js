const express = require('express');
const router = express.Router();
const versionService = require('../services/versionService');

// 获取当前版本号
router.get('/getCurrentVersion', (req, res) => {
	versionService.getCurrentVersion(req, res);
});

module.exports = router;
