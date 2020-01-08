const resultMessage = require("../util/resultMessage");
const request = require("request");
var xml2js = require("xml2js");	//引入xml解析模块
const PayUtil = require("../util/PayUtil");
const config = require("../util/AppConfig");
const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const sequelize = require("../dataSource/MysqlPoolClass");
const order = require("../models/order");
const orderModel = order(sequelize);

module.exports = {
	// 支付订单
	payOrder: async (req, res) => {
		try {
			let orderid = PayUtil.createOrderid();
			let params = {
				appid: config.appid,	//自己的小程序appid
				mch_id: config.mch_id,	//自己的商户号
				nonce_str: PayUtil.getNonceStr(),	//随机字符串
				body: "贝沃思美食",// 商品描述
				out_trade_no: orderid, // 用户订单号
				total_fee: (Number(req.query.total_fee) * 100).toFixed(0), //商品价格 单位分
				spbill_create_ip: "47.106.208.52", // 发起访问ip
				//异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
				notify_url: "https://www.kdsou.com/kdchange/service_bak/notify.php",
				trade_type: "JSAPI",// 默认 交易类型
				time: new Date().getTime(),	// 时间戳
				key: config.key, // 商户key
				openid: req.query.openid
			};

			// 签名算法
			let sign = PayUtil.createSign(Object.assign(
				{body: "微信支付，商品详细描述"},
				params
			));

			let reqUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";

			let formData = `<xml>
							<appid>${params.appid}</appid>
							<body>${params.body}</body>
							<mch_id>${params.mch_id}</mch_id>
							<nonce_str>${params.nonce_str}</nonce_str>
							<notify_url>${params.notify_url}</notify_url>
							<openid>${params.openid}</openid>
							<out_trade_no>${params.out_trade_no}</out_trade_no>
							<spbill_create_ip>${params.spbill_create_ip}</spbill_create_ip>
							<total_fee>${params.total_fee}</total_fee>
							<trade_type>${params.trade_type}</trade_type>
							<sign>${sign}</sign>
						</xml>`;
			//发起请求，获取微信支付的一些必要信息
			request({
				url: reqUrl,
				method: "POST",
				body: formData
			}, function(error, response, body) {
				if(error) {
					return res.send(resultMessage.success("支付失败"));
				} else if(!error && response.statusCode == 200) {
					xml2js.parseString(body,function(err,result){
						if(err) return res.send(resultMessage.success("支付失败"));
						let reData = result.xml;
						if(!reData.prepay_id) {
							return res.send(resultMessage.success(reData.err_code_des ? reData.err_code_des[0] : "支付失败"));
						}
						let responseData = {
							timeStamp: String(new Date().getTime()),
							nonceStr: reData.nonce_str[0] || "",
							package: "prepay_id=" + reData.prepay_id[0],
							code: orderid
						};
						let str = `appId=${config.appid}&nonceStr=${responseData.nonceStr}&package=${responseData.package}&signType=MD5&timeStamp=${responseData.timeStamp}&key=${config.key}`;
						responseData.paySign = md5(str).toUpperCase();
						return res.send(resultMessage.success(responseData));
					});
				}else{
					return res.send(resultMessage.success("支付失败"));
				}
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success("支付失败"));
		}
	},

	// 申请退款， 改变状态为退款中
	getBackMoneyStatus: async (req, res) => {
		try {
			let orderId = req.body.id;
			await orderModel.update({status: 6}, {
				where: {
					id: orderId
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 申请退款
	getBackPayMoney: async(req, res) => {
		try {
			let order = await orderModel.findOne({
				where: {
					id: req.body.id
				}
			});
			let total_price = order.total_price;
			let total_fee = order.back_money;
			let code = order.code;
			let params = {
				appid: config.appid,	//自己的小程序appid
				mch_id: config.mch_id,	//自己的商户号
				nonce_str: PayUtil.getNonceStr(),	//随机字符串
				out_refund_no: PayUtil.createOrderid(),// 商户退款单号
				out_trade_no: code, // 商户订单号
				total_fee: (Number(total_fee) * 100).toFixed(0), //商品价格 单位分
				refund_fee: (Number(total_price) * 100).toFixed(0), // 退款金额
				key: config.key, // 商户key
			};

			// 签名算法
			let sign = PayUtil.createBackSign(params);
			let reqUrl = "https://api.mch.weixin.qq.com/secapi/pay/refund";

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
			request({
				url: reqUrl,
				method: "POST",
				body: formData,
				//还记得准备的证书吗这里就用到啦
				agentOptions: {
					cert: fs.readFileSync(path.join(__dirname,"../apiclient_cert.pem")),
					key: fs.readFileSync(path.join(__dirname,"../apiclient_key.pem" ))
				},
			}, function(error, response, body) {
				if(error) {
					console.log(error);
					return res.send(resultMessage.success("支付失败"));
				} else if(!error && response.statusCode == 200) {
					xml2js.parseString(body,function(err,result){
						if(err) return res.send(resultMessage.success("退款失败"));
						let reData = result.xml;
						if(reData.return_code && reData.return_code[0] && reData.return_code[0] == "SUCCESS" && reData.return_msg && reData.return_msg[0] && reData.return_msg[0] == "OK") {
							orderModel.update({status: 7}, {
								where: {
									id: order.id
								}
							}).then(() => {
								if(reData.err_code && reData.err_code[0] && reData.err_code[0] == "ERROR"  && reData.err_code_des && reData.err_code_des[0]){
									return res.send(resultMessage.success(reData.err_code_des[0]));
								}
								return res.send(resultMessage.success("退款成功"));
							});
						}else {
							return res.send(resultMessage.success("退款失败"));
						}
					});
				}else{
					return res.send(resultMessage.success("退款失败"));
				}
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.success("支付失败"));
		}

	}
};
