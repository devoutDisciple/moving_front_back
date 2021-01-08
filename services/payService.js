const request = require('request');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const AlipaySdk = require('alipay-sdk').default;
// 引入xml解析模块
const urlencode = require('urlencode');
const AlipayFormData = require('alipay-sdk/lib/form').default;
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const order = require('../models/order');
const bill = require('../models/bill');
const user = require('../models/user');

const orderModel = order(sequelize);
const billModel = bill(sequelize);
const userModel = user(sequelize);
const config = require('../config/AppConfig');
const PayUtil = require('../util/PayUtil');

module.exports = {
	// 使用微信付款
	payOrderByWechat: async (req, res) => {
		try {
			const { desc, money, type, userid, given, orderid } = req.body;
			if (!type || !userid) return res.send(resultMessage.error('系统维护中，请稍后重试！'));
			// shopid: shopid,
			// home_time: home_time,
			// home_address: home_address,
			// home_username: home_username,
			// home_phone: home_phone,
			// home_desc: home_desc,
			let passback_params = '';
			// type分类： member-会员 recharge-余额充值 order-订单支付
			if (type === 'member' || type === 'recharge') {
				passback_params = { type, userid, money, given };
			}
			// 订单支付 或者 上门取衣费用
			if (type === 'order' || type === 'clothing') {
				passback_params = { type, userid, money, orderid };
			}
			if (type === 'save_clothing') {
				passback_params = { type, userid, money };
			}
			passback_params = JSON.stringify(passback_params);
			const out_trade_no = PayUtil.createOrderid();
			const params = {
				appid: config.appid, // 微信开放平台审核通过的应用APPID
				mch_id: config.mch_id, // 微信支付分配的商户号
				body: desc || 'MOVING洗衣', // 商品描述
				nonce_str: PayUtil.getNonceStr(), // 随机字符串
				out_trade_no, // 用户订单号
				total_fee: Number(Number(money) * 100).toFixed(0), // 商品价格 单位分
				// total_fee: 1, //商品价格 单位分
				spbill_create_ip: '47.107.43.166', // 发起访问ip
				// 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
				notify_url: 'http://47.107.43.166:3001/payResult/handleWechat',
				trade_type: 'APP', // 默认 交易类型
				// time: new Date().getTime(), // 时间戳
				key: config.key, // 商户key
				reqUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder', // 下单接口url
				attach: passback_params,
			};
			// 签名算法
			const sign = PayUtil.createSign(params);
			const formData = `<xml>
							<appid>${params.appid}</appid>
							<attach>${params.attach}</attach>
							<body>${params.body}</body>
							<mch_id>${params.mch_id}</mch_id>
							<nonce_str>${params.nonce_str}</nonce_str>
							<notify_url>${params.notify_url}</notify_url>
							<out_trade_no>${params.out_trade_no}</out_trade_no>
							<spbill_create_ip>${params.spbill_create_ip}</spbill_create_ip>
							<total_fee>${params.total_fee}</total_fee>
							<trade_type>${params.trade_type}</trade_type>
							<sign>${sign}</sign>
						</xml>`;
			// 发起请求，获取微信支付的一些必要信息
			request(
				{
					url: params.reqUrl,
					method: 'POST',
					body: formData,
				},
				(error, response, body) => {
					if (error) {
						console.log(error);
						return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
					}
					if (!error && Number(response.statusCode) === 200) {
						xml2js.parseString(body, (err, result) => {
							if (err) {
								console.log(err);
								return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
							}
							const reData = result.xml;
							if (!reData.prepay_id) {
								return res.send(resultMessage.error(reData.err_code_des ? reData.err_code_des[0] : '支付失败'));
							}
							const responseData = {
								appid: config.appid,
								mch_id: reData.mch_id[0] || '',
								nonce_str: reData.nonce_str[0] || '',
								prepay_id: reData.prepay_id[0] || '',
								// eslint-disable-next-line radix
								timeStamp: String(parseInt(new Date().getTime() / 1000)),
								nonceStr: reData.nonce_str[0] || '',
								package: 'Sign=WXPay',
								key: config.key, // 商户key
							};
							const newSign = PayUtil.createSecondSign(responseData);
							responseData.newSign = newSign;
							return res.send(resultMessage.success(responseData));
						});
					} else {
						return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
					}
				},
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success('支付失败'));
		}
	},

	// 使用支付宝付款
	payByOrderAlipay: async (req, res) => {
		try {
			const { desc, money, type, userid, given, orderid } = req.body;
			if (!type || !userid) return res.send(resultMessage.error('系统维护中，请稍后重试！'));
			let passback_params = '';
			// type分类： member-会员 recharge-余额充值 order-订单支付
			if (type === 'member' || type === 'recharge') {
				passback_params = `type=${type}&userid=${userid}&money=${money}&given=${given}`;
			}
			// 订单支付
			if (type === 'order' || type === 'clothing') {
				passback_params = `type=${type}&userid=${userid}&money=${money}&orderid=${orderid}`;
			}
			if (type === 'save_clothing') {
				passback_params = `type=${type}&userid=${userid}&money=${money}`;
			}
			const alipaySdk = new AlipaySdk({
				appId: config.alipayAppId, // 开放平台发的appid
				// 使用支付宝开发助手生成的csr文件
				privateKey: fs.readFileSync(path.join(__dirname, '../sshKey/movingcleaner.top_私钥.txt'), 'ascii'),
				// 以下三个是配置秘钥之后下载的秘钥
				alipayRootCertContent: fs.readFileSync(path.join(__dirname, '../sshKey/alipayRootCert.crt'), 'ascii'),
				appCertContent: fs.readFileSync(path.join(__dirname, '../sshKey/appCertPublicKey_2021001169609094.crt'), 'ascii'),
				alipayPublicCertContent: fs.readFileSync(path.join(__dirname, '../sshKey/alipayCertPublicKey_RSA2.crt'), 'ascii'),
				charset: 'utf-8', // 字符集编码
				version: '1.0', // 版本，默认 1.0
				signType: 'RSA2', // 秘钥的解码版本
			});
			const out_trade_no = PayUtil.createOrderid();
			const formData = new AlipayFormData();
			formData.setMethod('get');
			formData.addField('notifyUrl', 'http://47.107.43.166:3001/payResult/handleAlipy');
			const totalAmount = Number(money).toFixed(2);
			formData.addField('bizContent', {
				outTradeNo: out_trade_no,
				productCode: config.alipayProductCode,
				totalAmount,
				subject: desc, // 商品信息
				body: type,
				passback_params: urlencode(passback_params, 'gbk'),
			});
			const result = await alipaySdk.exec(config.alipayMethod, {}, { formData });
			const resData = result.split('https://openapi.alipay.com/gateway.do?')[1];
			res.send(resultMessage.success(resData));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success('支付失败'));
		}
	},

	// 使用余额支付
	payByOrderByBalance: async (req, res) => {
		try {
			const { userid, orderid, money } = req.body;
			const currentUser = await userModel.findOne({
				where: {
					id: userid,
				},
			});
			const currentBalance = Number(currentUser.balance);
			if (currentBalance < Number(money)) {
				return res.send(resultMessage.error('可用余额不足'));
			}
			const useabledMoney = Number(Number(currentUser.balance) - Number(money)).toFixed(2);
			// 更新用户余额
			await userModel.update({ balance: useabledMoney }, { where: { id: userid } });
			// 查询当前订单详情
			const currentOrderDetail = await orderModel.findOne({ where: { id: orderid } });
			// 支付信息入库
			billModel.create({
				code: currentOrderDetail.code,
				userid,
				orderid,
				money,
				pay_type: 'account',
				type: 'order',
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			// 将要更新的状态
			let status = 5;
			// 如果是支付订单金额,如果是存放在柜子里
			if (currentOrderDetail.status === 3 && currentOrderDetail.cabinetId && currentOrderDetail.boxid && currentOrderDetail.cellid) {
				status = 4;
			}
			// 如果是支付订单金额,此时订单已经派送到用户手中
			if (
				currentOrderDetail.status === 3 &&
				currentOrderDetail.send_home === 2 &&
				!currentOrderDetail.cabinetId &&
				!currentOrderDetail.boxid
			) {
				status = 5;
			}
			// 更改订单状态
			await orderModel.update({ status }, { where: { id: orderid } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success('支付失败'));
		}
	},
};
