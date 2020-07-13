const resultMessage = require('../util/resultMessage');
const request = require('request');
var xml2js = require('xml2js'); //引入xml解析模块
const PayUtil = require('../util/PayUtil');
const config = require('../config/AppConfig');
const sequelize = require('../dataSource/MysqlPoolClass');
const order = require('../models/order');
const orderModel = order(sequelize);
const user = require('../models/user');
const userModel = user(sequelize);
const fs = require('fs');
const urlencode = require('urlencode');
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default;
const path = require('path');

module.exports = {
	// 使用微信付款
	payOrderByWechat: async (req, res) => {
		try {
			let { desc, money, type, userid, given, orderid } = req.body;
			let passback_params = '';
			//type分类： member-会员 recharge-余额充值 order-订单支付
			if (type === 'member' || type === 'recharge') {
				passback_params = { type: type, userid: userid, money: money, given: given };
			}
			// 订单支付
			if (type === 'order') {
				passback_params = { type: type, userid: userid, money: money, orderid: orderid };
			}
			passback_params = JSON.stringify(passback_params);
			let out_trade_no = PayUtil.createOrderid();
			let params = {
				appid: config.appid, //微信开放平台审核通过的应用APPID
				mch_id: config.mch_id, //微信支付分配的商户号
				body: desc || 'MOVING洗衣', // 商品描述
				nonce_str: PayUtil.getNonceStr(), //随机字符串
				out_trade_no: out_trade_no, // 用户订单号
				total_fee: Number(money) * 100, //商品价格 单位分
				// total_fee: 1, //商品价格 单位分
				spbill_create_ip: '47.107.43.166', // 发起访问ip
				//异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
				notify_url: 'http://47.107.43.166:3001/payResult/handleWechat',
				trade_type: 'APP', // 默认 交易类型
				// time: new Date().getTime(), // 时间戳
				key: config.key, // 商户key
				reqUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder', // 下单接口url
				attach: passback_params,
			};
			// 签名算法
			let sign = PayUtil.createSign(params);
			let formData = `<xml>
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
			//发起请求，获取微信支付的一些必要信息
			request(
				{
					url: params.reqUrl,
					method: 'POST',
					body: formData,
				},
				function (error, response, body) {
					if (error) {
						console.log(error);
						return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
					} else if (!error && response.statusCode == 200) {
						xml2js.parseString(body, function (err, result) {
							if (err) {
								console.log(err);
								return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
							}
							let reData = result.xml;
							if (!reData.prepay_id) {
								return res.send(resultMessage.error(reData.err_code_des ? reData.err_code_des[0] : '支付失败'));
							}
							let responseData = {
								appid: config.appid,
								mch_id: reData.mch_id[0] || '',
								nonce_str: reData.nonce_str[0] || '',
								prepay_id: reData.prepay_id[0] || '',
								timeStamp: String(parseInt(new Date().getTime() / 1000)),
								nonceStr: reData.nonce_str[0] || '',
								package: 'Sign=WXPay',
								key: config.key, // 商户key
							};
							let newSign = PayUtil.createSecondSign(responseData);
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
			let { desc, money, type, userid, given, orderid } = req.body;
			let passback_params = '';
			//type分类： member-会员 recharge-余额充值 order-订单支付
			if (type === 'member' || type === 'recharge') {
				passback_params = `type=${type}&userid=${userid}&money=${money}&given=${given}`;
			}
			// 订单支付
			if (type === 'order') {
				passback_params = `type=${type}&userid=${userid}&money=${money}&orderid=${orderid}`;
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
			let out_trade_no = PayUtil.createOrderid();
			const formData = new AlipayFormData();
			formData.setMethod('get');
			formData.addField('notifyUrl', 'http://47.107.43.166:3001/payResult/handleAlipy');
			let totalAmount = Number(money).toFixed(2);
			formData.addField('bizContent', {
				outTradeNo: out_trade_no,
				productCode: config.alipayProductCode,
				totalAmount: totalAmount,
				subject: desc, // 商品信息
				body: type,
				passback_params: urlencode(passback_params, 'gbk'),
			});
			const result = await alipaySdk.exec(config.alipayMethod, {}, { formData: formData });
			let resData = result.split('https://openapi.alipay.com/gateway.do?')[1];
			res.send(resultMessage.success(resData));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success('支付失败'));
		}
	},

	// 使用余额支付
	payByOrderByBalance: async (req, res) => {
		try {
			let { userid, orderid, money } = req.body;
			let currentUser = await userModel.findOne({
				where: {
					id: userid,
				},
			});
			let currentBalance = Number(currentUser.balance);
			if (currentBalance < Number(money)) {
				return res.send(resultMessage.error('可用余额不足'));
			}
			// 更新用户余额
			await userModel.update(
				{
					balance: parseInt(Number(Number(currentUser.balance) - Number(money))),
				},
				{ where: { id: userid } },
			);
			// 更改订单状态
			await orderModel.update({ status: 4 }, { where: { id: orderid } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success('支付失败'));
		}
	},

	// 申请退款
	getBackPayMoney: async (req, res) => {
		try {
			let order = await orderModel.findOne({
				where: {
					id: req.body.id,
				},
			});
			let total_price = order.total_price;
			let total_fee = order.back_money;
			let code = order.code;
			let params = {
				appid: config.appid, //自己的小程序appid
				mch_id: config.mch_id, //自己的商户号
				nonce_str: PayUtil.getNonceStr(), //随机字符串
				out_refund_no: PayUtil.createOrderid(), // 商户退款单号
				out_trade_no: code, // 商户订单号
				total_fee: (Number(total_fee) * 100).toFixed(0), //商品价格 单位分
				refund_fee: (Number(total_price) * 100).toFixed(0), // 退款金额
				key: config.key, // 商户key
			};

			// 签名算法
			let sign = PayUtil.createBackSign(params);
			let reqUrl = 'https://api.mch.weixin.qq.com/secapi/pay/refund';

			let formData = `<xml>
							<appid>${params.appid}</appid>
							<mch_id>${params.mch_id}</mch_id>
							<nonce_str>${params.nonce_str}</nonce_str>
							<out_refund_no>${params.out_refund_no}</out_refund_no>
							<out_trade_no>${params.out_trade_no}</out_trade_no>
							<refund_fee>${params.refund_fee}</refund_fee>
							<total_fee>${params.total_fee}</total_fee>
							<sign>${sign}</sign>
						</xml>`;
			//发起请求，获取微信支付的一些必要信息
			request(
				{
					url: reqUrl,
					method: 'POST',
					body: formData,
					agentOptions: {
						cert: fs.readFileSync(path.join(__dirname, '../apiclient_cert.pem')),
						key: fs.readFileSync(path.join(__dirname, '../apiclient_key.pem')),
					},
				},
				function (error, response, body) {
					if (error) {
						console.log(error);
						return res.send(resultMessage.success('支付失败'));
					} else if (!error && response.statusCode == 200) {
						xml2js.parseString(body, function (err, result) {
							if (err) return res.send(resultMessage.success('退款失败'));
							let reData = result.xml;
							if (
								reData.return_code &&
								reData.return_code[0] &&
								reData.return_code[0] == 'SUCCESS' &&
								reData.return_msg &&
								reData.return_msg[0] &&
								reData.return_msg[0] == 'OK'
							) {
								orderModel
									.update(
										{ status: 7 },
										{
											where: {
												id: order.id,
											},
										},
									)
									.then(() => {
										if (
											reData.err_code &&
											reData.err_code[0] &&
											reData.err_code[0] == 'ERROR' &&
											reData.err_code_des &&
											reData.err_code_des[0]
										) {
											return res.send(resultMessage.success(reData.err_code_des[0]));
										}
										return res.send(resultMessage.success('success'));
									});
							} else {
								return res.send(resultMessage.success('退款失败'));
							}
						});
					} else {
						return res.send(resultMessage.success('退款失败'));
					}
				},
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success('支付失败'));
		}
	},
};
