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

// 成为会员
router.post('/beMember', (req, res) => {
	userService.beMember(req, res);
});

// 余额充值
router.post('/recharge', (req, res) => {
	userService.recharge(req, res);
});

module.exports = router;
