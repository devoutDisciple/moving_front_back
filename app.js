const express = require("express");
const app = express();
const logger = require("morgan");
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const sessionParser = require("express-session");
const bodyParser = require("body-parser");
const controller = require("./controller/index");
const fs = require("fs");
const https = require("https");
const path = require("path");
const privateKey = fs.readFileSync(path.join(__dirname, "./2361522_bws666.com.key"), "utf8");
const certificate = fs.readFileSync(path.join(__dirname, "./2361522_bws666.com.pem"), "utf8");
// const pfx = fs.readFileSync(path.join(__dirname, "./apiclient_cert.p12"), "utf8");
// let pfx = {
// 	pfx: fs.readFileSync(path.join(__dirname, "./apiclient_cert.p12"), "utf8"), //微信商户平台证书,
// 	passphrase: 1537649941 // 商家id
// };
const credentials = {
	// pfx: pfx, //微信商户平台证书,
	key: privateKey,
	cert: certificate,
};
/* global __dirname */

// 解析cookie和session还有body
app.use(cookieParser()); // 挂载中间件，可以理解为实例化
app.use(sessionParser({
	"secret": "ruidoc",     // 签名，与上文中cookie设置的签名字符串一致，
	"cookie": {
		"maxAge": 90000
	},
	"name": "session_id"    // 在浏览器中生成cookie的名称key，默认是connect.sid
}));
// app.use(express.static(path.join(__dirname, "./public")));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 打印日志
app.use(logger(":method :url :status :res[content-length] - :response-time ms"));

app.all("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", "3.2.1");
	next();
});

// 路由 controller层
controller(app);

const httpsServer = https.createServer(credentials, app);

// 启动服务器，监听对应的端口
httpsServer.listen(443, () => {
	console.log(chalk.yellow("server is listenning 443"));
});

// 监听3001端口
app.listen(3001, () => {
	console.log(chalk.yellow("广州小程序：server is listenning 3001"));
});
