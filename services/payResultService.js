const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');

const user = require('../models/user');
const userModel = user(sequelize);

const order = require('../models/order');
const orderModel = order(sequelize);

const shop = require('../models/shop');
const shopModel = shop(sequelize);
orderModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

const bill = require('../models/bill');
const billModal = bill(sequelize);

const urlencode = require('urlencode');
const moment = require('moment');

const PostMessage = require('../util/PostMessage');

const getAlipayParams = async (req) => {
	let resBody = req.body;
	let params = urlencode.parse(`value=${resBody.passback_params}`, { charset: 'gbk' });
	let value = params.value;
	let arr = value.split('&');
	let payMsg = {};
	arr.forEach((item) => {
		let tempArr = item.split('=');
		payMsg[tempArr[0]] = tempArr[1];
	});
	return payMsg;
};

const handlePayByType = async (payMsg, code, pay_type) => {
	let user = await userModel.findOne({ where: { id: payMsg.userid } });
	if (payMsg.type === 'member' || payMsg.type === 'recharge') {
		let currentBalance = user.balance;
		let currentIntegral = user.integral;
		let totalBalance = (Number(currentBalance) + Number(payMsg.money) + Number(payMsg.given)).toFixed(2);
		let totalIntegral = (Number(currentIntegral) + Number(payMsg.money) + Number(payMsg.given)).toFixed(0);
		// 支付信息入库
		await billModal.create({
			code,
			userid: payMsg.userid,
			money: payMsg.money,
			type: payMsg.type,
			pay_type: pay_type,
			send: payMsg.given,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		await userModel.update(
			{ balance: totalBalance, integral: totalIntegral, member: 2 },
			{
				where: {
					id: payMsg.userid,
				},
			},
		);
	}
	// 订单支付
	if (payMsg.type === 'order') {
		// 支付信息入库
		await billModal.create({
			code,
			userid: payMsg.userid,
			orderid: payMsg.orderid,
			money: payMsg.money,
			pay_type: pay_type,
			type: payMsg.type,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		// 更改订单状态
		await orderModel.update({ status: 4 }, { where: { id: payMsg.orderid } });
		// 增加用户积分
		let currentIntergral = user.integral;
		let updateIntergral = (Number(currentIntergral) + parseInt(Number(payMsg.money))).toFixed(0);
		await userModel.update(
			{ integral: updateIntergral },
			{
				where: {
					id: payMsg.userid,
				},
			},
		);
	}
	// 上门取衣支付
	if (payMsg.type === 'clothing') {
		// 支付信息入库
		await billModal.create({
			code,
			userid: payMsg.userid,
			orderid: payMsg.orderid,
			money: payMsg.money,
			pay_type: pay_type,
			type: payMsg.type,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		// 更改订单状态
		await orderModel.update({ status: 8, send_money: payMsg.money }, { where: { id: payMsg.orderid } });
		// 增加用户积分
		let currentIntergral = user.integral;
		let updateIntergral = (Number(currentIntergral) + 10).toFixed(0);
		await userModel.update(
			{ integral: updateIntergral },
			{
				where: {
					id: payMsg.userid,
				},
			},
		);
		// 发送信息给用户
		let orderDetail = await orderModel.findOne({ where: { id: payMsg.orderid } });
		PostMessage.sendMessageGetClothingSuccessToUser(orderDetail.home_phone);
		let result = await orderModel.findOne({
			where: { id: payMsg.orderid },
			include: [
				{
					model: shopModel,
					as: 'shopDetail',
				},
			],
		});
		let shopPhone = result.shopDetail.phone;
		if (!shopPhone || !result.code) return;
		PostMessage.sendMessageGetClothingSuccessToShop(shopPhone, result.code);
	}
	// 洗衣柜使用费用支付
	if (payMsg.type === 'save_clothing') {
		// 支付信息入库
		await billModal.create({
			code,
			userid: payMsg.userid,
			money: payMsg.money,
			pay_type: pay_type,
			type: payMsg.type,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		// 增加用户积分
		let currentIntergral = user.integral;
		let updateIntergral = (Number(currentIntergral) + 1).toFixed(0);
		let cabinet_use_time = user.cabinet_use_time;
		let updateCabinetUseTimes = (Number(cabinet_use_time) + 1).toFixed(0);
		// 增加柜子使用次数
		await userModel.update(
			{ integral: updateIntergral, cabinet_use_time: updateCabinetUseTimes },
			{
				where: {
					id: payMsg.userid,
				},
			},
		);
	}
};

module.exports = {
	// 处理支付宝支付成功接口
	handleAlipy: async (req, res) => {
		try {
			if (!req.body || !req.body.passback_params) return res.send(resultMessage.error('支付失败'));
			let alipayRes = req.body;
			let code = alipayRes.out_trade_no;
			// type： member-成为会员 recharge-充值 order-订单支付
			// 查看是否已经村则该订单
			let currentBill = await billModal.findOne({ where: { code: code } });
			if (currentBill) return;
			let payMsg = await getAlipayParams(req);
			// { type: 'member', userid: '10', money: '0.01', given: '400' }
			// 会员充值 或者余额充值
			await handlePayByType(payMsg, code, 'alipay');
			return res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 处理微信支付回调
	handleWechat: async (req, res) => {
		try {
			let resBody = req.body;
			if (!resBody.xml || resBody.xml.result_code != 'SUCCESS') return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			let code = resBody.xml.out_trade_no;
			// type： member-成为会员 recharge-充值 order-订单支付
			// 查看是否已经村则该订单
			let currentBill = await billModal.findOne({ where: { code: code } });
			if (currentBill) return;
			let payMsg = JSON.parse(resBody.xml.attach);
			// { type: 'member', userid: '10', money: '0.01', given: '400' }
			// 会员充值 或者余额充值
			await handlePayByType(payMsg, code, 'wechat');

			var json2Xml = function (json) {
				let _xml = '';
				Object.keys(json).map((key) => {
					_xml += `<${key}>${json[key]}</${key}>`;
				});
				return `<xml>${_xml}</xml>`;
			};
			var sendData = {
				return_code: 'SUCCESS',
				return_msg: 'OK',
			};
			return res.end(json2Xml(sendData));
			// res.setHeader('Content-Type', 'text/html');
			// let returnData = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
			// return res.send(returnData);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
