const express = require("express");
const router = express.Router();
const loginService = require("../services/loginService");

// 账号密码登录
router.post("/byPassword", (req, res) => {
	loginService.byPassword(req, res);
});

// 发送短信验证码
router.post("/sendMessage", (req, res) => {
	loginService.sendMessage(req, res);
});

// 验证码登录
router.post("/bySercurityCode", (req, res) => {
	loginService.bySercurityCode(req, res);
});

// 修改密码
router.post("/resetPassword", (req, res) => {
	loginService.resetPassword(req, res);
});

module.exports = router;
