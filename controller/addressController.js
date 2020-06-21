const express = require('express');
const router = express.Router();
const addressService = require('../services/addressService');

// 根绝用户id获取所有地址
router.get('/getAllByUserid', (req, res) => {
	addressService.getAllByUserid(req, res);
});

// 根据地址id查询地址 getAddressById
router.get('/getAddressById', (req, res) => {
	addressService.getAddressById(req, res);
});

// 改变默认地址 changeDefalut
router.post('/changeDefalut', (req, res) => {
	addressService.changeDefalut(req, res);
});

// 新增地址 address
router.post('/add', (req, res) => {
	addressService.add(req, res);
});

// 修改地址
router.post('/update', (req, res) => {
	addressService.update(req, res);
});

// 获取用户默认收货地址
router.get('/getUserDefaultAddress', (req, res) => {
	addressService.getUserDefaultAddress(req, res);
});

module.exports = router;
