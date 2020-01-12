const express = require("express");
const router = express.Router();
const loginService = require("../services/loginService");
const multer  = require("multer");
const AppConfig = require("../config/AppConfig");
const filePath = AppConfig.swiperImgFilePath;
const ObjectUtil = require("../util/ObjectUtil");

let filename = "";
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.jpg
		filename = ObjectUtil.getName() + "-" + Date.now() + ".jpg";
		cb(null, filename);
	}
});
let upload = multer({ dest: filePath, storage: storage });

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

// 测试
router.post("/upload", upload.single("file"), (req, res) => {
	loginService.upload(req, res, filename);
});

module.exports = router;
