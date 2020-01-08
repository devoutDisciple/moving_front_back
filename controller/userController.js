const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// 用户注册，返回openid
router.post("/register", (req, res) => {
	userService.register(req, res);
});
// 判断用户是否存在
router.post("/getUser", (req, res) => {
	userService.getUser(req, res);
});
// 通过openid获取用户信息
router.get("/getUserByOpenid", (req, res) => {
	userService.getUserByOpenid(req, res);
});
// 填写收货地址
router.post("/addAddress", (req, res) => {
	userService.addAddress(req, res);
});
// 更改收货地址
router.post("/updateAddress", (req, res) => {
	userService.updateAddress(req, res);
});

module.exports = router;
