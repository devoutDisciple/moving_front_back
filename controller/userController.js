const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// 根据token获取当前用户信息
router.get('/getUserByToken', (req, res) => {
	userService.getUserByToken(req, res);
});

// 根据token获取当前用户信息
router.get('/getUserByUserid', (req, res) => {
	userService.getUserByUserid(req, res);
});

// 修改用户头像
router.post('/addPhoto', (req, res) => {
	userService.addPhoto(req, res);
});

// 修改用户信息
router.post('/update', (req, res) => {
	userService.update(req, res);
});

// 更改用户积分 updateUserIntergral
router.post('/updateUserIntergral', (req, res) => {
	userService.updateUserIntergral(req, res);
});

// 成为会员
router.post('/beMember', (req, res) => {
	userService.beMember(req, res);
});

// 获取用户使用柜子次数 getUserCabinetUseTimeByUserid
router.get('/getUserCabinetUseTimeByUserid', (req, res) => {
	userService.getUserCabinetUseTimeByUserid(req, res);
});

// 减少用户使用柜子次数 subCabinetUseTime
router.post('/subCabinetUseTime', (req, res) => {
	userService.subCabinetUseTime(req, res);
});

// 余额充值
router.post('/recharge', (req, res) => {
	userService.recharge(req, res);
});

module.exports = router;
