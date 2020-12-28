const express = require('express');

const app = express();
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const sessionParser = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const controller = require('./controller/index');
const config = require('./config/Env');
const ChangeLog = require('./middleware/ChangeLog');
const LogMiddleware = require('./middleware/LogMiddleware');
require('./schedule');

// 解析cookie和session还有body
app.use(cookieParser()); // 挂载中间件，可以理解为实例化

app.use(
	sessionParser({
		secret: 'ruidoc', // 签名，与上文中cookie设置的签名字符串一致，
		cookie: {
			maxAge: 90000,
		},
		name: 'session_id', // 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: false,
		saveUninitialized: true,
	}),
);

app.use(express.static(config.env ? '/root/asserts' : path.join(__dirname, './public')));

app.use((req, res, next) => {
	if (req.url === '/pay/getAlipayResult') {
		req.headers['content-type'] = 'application/x-www-form-urlencoded';
	}
	next();
});

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 改变默认的log
ChangeLog.changeLog();

// 改变默认的info
ChangeLog.changeInfo();

// 改变默认的error
ChangeLog.changeError();

// 自定义日志
app.use(LogMiddleware);

app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Credentials', true); // 可以带cookies
	res.header('X-Powered-By', '3.2.1');
	next();
});

// 路由 controller层
controller(app);

// 监听3001端口
app.listen(3001, () => {
	console.log(chalk.yellow('moving洗衣店：server is listenning 3001'));
});
