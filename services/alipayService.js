const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');

const user = require('../models/user');
const userModel = user(sequelize);

const order = require('../models/order');
const orderModel = order(sequelize);

const urlencode = require('urlencode');

module.exports = {
	// 处理支付宝支付成功接口
	handleOrder: async (req, res) => {
		try {
			if (!req.body || !req.body.passback_params) return res.send(resultMessage.error('支付失败'));
			let params = urlencode.parse(`value=${req.body.passback_params}`, { charset: 'gbk' });
			let value = params.value;
			let arr = value.split('&');
			let payMsg = {};
			arr.forEach((item) => {
				let tempArr = item.split('=');
				payMsg[tempArr[0]] = tempArr[1];
			});
			// { type: 'member', userid: '10', money: '0.01', given: '400' }
			// 会员充值 或者余额充值
			let user = await userModel.findOne({ where: { id: payMsg.userid } });
			if (payMsg.type === 'member' || payMsg.type === 'recharge') {
				let currentBalance = user.balance;
				let currentIntegral = user.integral;
				let totalBalance = Number(currentBalance) + Number(payMsg.money) + Number(payMsg.given);
				let totalIntegral = Number(currentIntegral) + Number(payMsg.money) + Number(payMsg.given);
				console.log(currentBalance, currentIntegral, totalBalance, totalIntegral, '最后结果');
				await userModel.update(
					{ balance: totalBalance, integral: totalIntegral, member: 2 },
					{
						where: {
							id: payMsg.userid,
						},
					},
				);
				return res.send(resultMessage.success('success'));
			}
			// 订单支付
			if (payMsg.type === 'order') {
				// 更改订单状态
				await orderModel.update({ status: 4 }, { where: { id: payMsg.orderid } });
				// 增加用户积分
				let currentIntergral = user.integral;
				let updateIntergral = Number(currentIntergral) + parseInt(Number(payMsg.money));
				await userModel.update(
					{ integral: updateIntergral },
					{
						where: {
							id: payMsg.userid,
						},
					},
				);
				return res.send(resultMessage.success('success'));
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
