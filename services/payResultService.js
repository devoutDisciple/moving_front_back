const urlencode = require('urlencode');
const moment = require('moment');
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

const account = require('../models/account');

const accountModel = account(sequelize);

const PrintUtil = require('../util/PrintUtil');
const PostMessage = require('../util/PostMessage');

const config = require('../config/AppConfig');

const getAlipayParams = async req => {
	const resBody = req.body;
	const params = urlencode.parse(`value=${resBody.passback_params}`, { charset: 'gbk' });
	const { value } = params;
	const arr = value.split('&');
	const payMsg = {};
	arr.forEach(item => {
		const tempArr = item.split('=');
		payMsg[tempArr[0]] = tempArr[1];
	});
	return payMsg;
};

const handlePayByType = async (payMsg, code, pay_type) => {
	const userDetail = await userModel.findOne({ where: { id: payMsg.userid } });
	if (payMsg.type === 'member' || payMsg.type === 'recharge') {
		const currentBalance = userDetail.balance;
		const currentIntegral = userDetail.integral;
		const totalBalance = (Number(currentBalance) + Number(payMsg.money) + Number(payMsg.given)).toFixed(2);
		const totalIntegral = (Number(currentIntegral) + Number(payMsg.money) + Number(payMsg.given)).toFixed(0);
		// 支付信息入库
		await billModal.create({
			code,
			userid: payMsg.userid,
			money: payMsg.money,
			type: payMsg.type,
			pay_type,
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
			pay_type,
			type: payMsg.type,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		// 更改订单状态
		const currentOrderDetail = await orderModel.findOne({ where: { id: payMsg.orderid } });
		// 将要更新的状态
		let status = 4;
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
		await orderModel.update({ status }, { where: { id: payMsg.orderid } });
		// 增加用户积分
		const currentIntergral = userDetail.integral;
		const updateIntergral = (Number(currentIntergral) + Number(payMsg.money)).toFixed(0);
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
			pay_type,
			type: payMsg.type,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		const currentOrderDetail = await orderModel.findOne({ where: { id: payMsg.orderid } });
		// 如果是预付上门取衣费用
		if (currentOrderDetail.status === 6) {
			// 更改订单状态
			await orderModel.update({ status: 8, send_money: payMsg.money }, { where: { id: payMsg.orderid } });
		}

		// 如果是支付订单金额,如果是存放在柜子里
		if (currentOrderDetail.status === 3 && currentOrderDetail.cabinetId && currentOrderDetail.boxid && currentOrderDetail.cellid) {
			// 更改订单状态
			await orderModel.update({ status: 4, send_money: payMsg.money }, { where: { id: payMsg.orderid } });
		}

		// 如果是支付订单金额,此时订单已经派送到用户手中
		if (
			currentOrderDetail.status === 3 &&
			currentOrderDetail.send_home === 2 &&
			!currentOrderDetail.cabinetId &&
			!currentOrderDetail.boxid
		) {
			// 更改订单状态
			await orderModel.update({ status: 5, send_money: payMsg.money }, { where: { id: payMsg.orderid } });
		}

		// 增加用户积分
		const currentIntergral = userDetail.integral;
		const updateIntergral = Number(Number(currentIntergral) + Number(payMsg.money)).toFixed(0);
		await userModel.update(
			{ integral: updateIntergral },
			{
				where: {
					id: payMsg.userid,
				},
			},
		);
		if (config.send_message_flag === 2) return;
		// 发送信息给用户
		const orderDetail = await orderModel.findOne({ where: { id: payMsg.orderid } });
		PostMessage.sendMessageGetClothingSuccessToUser(orderDetail.home_phone);

		// 批量发送消息给商家
		const { shopid } = orderDetail;
		if (!shopid || !orderDetail.code) return;
		const accountLists = await accountModel.findAll({ where: { shopid } });
		const phoneList = [];
		if (Array.isArray(accountLists)) {
			accountLists.forEach(item => {
				phoneList.push(item.phone);
			});
		}
		PostMessage.sendMessageGetClothingSuccessToShopBatch(phoneList, orderDetail.code);

		// 打印商户订单
		const result = await orderModel.findOne({
			where: { id: payMsg.orderid },
			include: [
				{
					model: shopModel,
					as: 'shopDetail',
				},
			],
		});
		if (result.shopDetail.sn && result.id) {
			PrintUtil.printOrderByOrderId(result.id);
		}
	}

	// 洗衣柜使用费用支付
	if (payMsg.type === 'save_clothing') {
		// 支付信息入库
		await billModal.create({
			code,
			userid: payMsg.userid,
			money: payMsg.money,
			pay_type,
			type: payMsg.type,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		// 增加用户积分
		const currentIntergral = userDetail.integral;
		const updateIntergral = (Number(currentIntergral) + 1).toFixed(0);
		const { cabinet_use_time } = userDetail;
		const updateCabinetUseTimes = (Number(cabinet_use_time) + 1).toFixed(0);
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
			const alipayRes = req.body;
			const code = alipayRes.out_trade_no;
			// type： member-成为会员 recharge-充值 order-订单支付
			// 查看是否已经村则该订单
			const currentBill = await billModal.findOne({ where: { code } });
			if (currentBill) return;
			const payMsg = await getAlipayParams(req);
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
			const resBody = req.body;
			if (!resBody.xml || resBody.xml.result_code !== 'SUCCESS') return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			const code = resBody.xml.out_trade_no;
			// type： member-成为会员 recharge-充值 order-订单支付
			// 查看是否已经村则该订单
			const currentBill = await billModal.findOne({ where: { code } });
			if (currentBill) return;
			const payMsg = JSON.parse(resBody.xml.attach);
			// { type: 'member', userid: '10', money: '0.01', given: '400' }
			// 会员充值 或者余额充值
			await handlePayByType(payMsg, code, 'wechat');

			const json2Xml = json => {
				let XML = '';
				Object.keys(json).forEach(key => {
					XML += `<${key}>${json[key]}</${key}>`;
				});
				return `<xml>${XML}</xml>`;
			};
			const sendData = {
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
