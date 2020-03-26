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
const credentials = {/* eslint-disable react-native/no-inline-styles */
	import React from 'react';
	import PayItem from './PayItem';
	import MoneyItem from './MoneyItem';
	import FastImage from '../component/FastImage';
	import CommonHeader from '../component/CommonHeader';
	import CommonStyle from '../style/common';
	import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
	const {width} = Dimensions.get('window');
	
	export default class ReCharge extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				activeMoney: 1,
				payWay: 'alipay',
			};
		}
	
		componentDidMount() {}
	
		// 支付金额改变
		onPressChargeItem(key) {
			this.setState({activeMoney: key});
		}
	
		// 支付方式改变
		payWayChange(key) {
			this.setState({payWay: key});
		}
	
		render() {
			const {navigation} = this.props;
			let {activeMoney, payWay} = this.state;
			return (
				<View style={styles.container}>
					<CommonHeader title="充值" navigation={navigation} />
					<ScrollView style={styles.content}>
						<FastImage
							style={styles.content_logo}
							source={require('../../img/public/logo2.png')}
						/>
						<View style={styles.detail_common_title}>
							<Text style={{fontSize: 14, color: '#333'}}>
								余额充值
							</Text>
						</View>
						<View style={styles.content_account}>
							<MoneyItem
								money={1000}
								discount={200}
								active={activeMoney === 1}
								onPress={this.onPressChargeItem.bind(this, 1)}
							/>
							<MoneyItem
								money={500}
								discount={80}
								active={activeMoney === 2}
								onPress={this.onPressChargeItem.bind(this, 2)}
							/>
							<MoneyItem
								money={200}
								discount={20}
								active={activeMoney === 3}
								onPress={this.onPressChargeItem.bind(this, 3)}
							/>
							<MoneyItem
								money={100}
								active={activeMoney === 4}
								onPress={this.onPressChargeItem.bind(this, 4)}
							/>
						</View>
						<View style={styles.detail_common_title}>
							<Text style={{fontSize: 14, color: '#333'}}>
								选择支付方式
							</Text>
						</View>
						<PayItem
							iconName="alipay-circle"
							onPress={this.payWayChange.bind(this, 'alipay')}
							iconColor="#208ee9"
							text="支付宝支付"
							active={payWay === 'alipay'}
						/>
						<PayItem
							iconName="wechat"
							onPress={this.payWayChange.bind(this, 'wechat')}
							iconColor="#89e04c"
							text="微信支付"
							active={payWay === 'wechat'}
						/>
					</ScrollView>
					<View style={styles.bottom_btn}>
						<Text style={styles.bottom_btn_text}>确认支付</Text>
					</View>
				</View>
			);
		}
	}
	
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#fff',
		},
		content: {
			flex: 1,
			// backgroundColor: 'red',
			paddingHorizontal: 10,
		},
		content_logo: {
			width: width - 20,
			height: 0.4 * width,
		},
		detail_common_title: CommonStyle.detail_common_title,
		detail_common_title: {
			height: 20,
			marginVertical: 10,
			justifyContent: 'center',
			paddingLeft: 10,
			borderLeftColor: '#fb9dd0',
			borderLeftWidth: 3,
			marginBottom: 10,
		},



	});
	
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
