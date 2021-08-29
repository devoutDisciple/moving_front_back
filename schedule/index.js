const Sequelize = require('sequelize');
const schedule = require('node-schedule');
const moment = require('moment');

const Op = Sequelize.Op;
const shelljs = require('shelljs');
const sequelize = require('../dataSource/MysqlPoolClass');
const order = require('../models/order');
const bill = require('../models/bill');
const user = require('../models/user');
const CountUtil = require('../util/CountUtil');
const ranking = require('../models/ranking');
const MoneyUtil = require('../util/MoneyUtil');
const sqlConfig = require('../config/sqlConfig');

const rankingModal = ranking(sequelize);

const orderModel = order(sequelize);
const billModel = bill(sequelize);
const userModel = user(sequelize);
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const sqlFormat = 'YYYY-MM-DD:HH-mm';

orderModel.belongsTo(userModel, { foreignKey: 'userid', targetKey: 'id', as: 'userDetail' });

// 查询洗衣排名
const searchOrders = async type => {
	try {
		const orders = await orderModel.findAll({
			where: {
				create_time: {
					[Op.gte]: moment()
						.subtract(type === 1 ? 7 : 30, 'days')
						.format(timeFormat),
				},
				order_type: [1, 2, 3, 5],
				is_delete: 1,
				status: 5,
				userid: {
					[Op.not]: 'NULL',
				},
			},
			include: [
				{
					model: userModel,
					as: 'userDetail',
				},
			],
		});
		const orderListByUserid = [];
		if (!orders && orders.length === 0) return;
		orders.forEach(async item => {
			MoneyUtil.countMoney(item);
			if (!item.userDetail) return;
			const username = item.userDetail ? item.userDetail.username : '**';
			const photo = item.userDetail ? item.userDetail.photo : '';
			if (orderListByUserid.filter(ele => ele.userid === item.userid).length === 0) {
				orderListByUserid.push({
					orderids: [item.id],
					userid: item.userid,
					username,
					photo,
					money: item.payMoney,
					discount: item.subDiscountMoney,
					create_time: moment().format(timeFormat),
					type,
				});
			} else {
				orderListByUserid.forEach(ele => {
					if (ele.userid === item.userid) {
						ele.money = CountUtil.sumFloat(ele.money, item.payMoney);
						ele.username = username;
						ele.photo = photo;
						ele.discount = CountUtil.sumFloat(ele.discount, item.subDiscountMoney);
						if (ele.orderids) {
							ele.orderids.push(item.id);
						} else {
							ele.orderids = [item.id];
						}
					}
				});
			}
		});
		orderListByUserid.forEach(item => {
			if (item.orderids && Array.isArray(item.orderids)) item.orderids = item.orderids.join(',');
		});

		// 清除表中所有数据
		if (type === 1) await rankingModal.destroy({ where: {}, truncate: true });
		// 批量增加
		await rankingModal.bulkCreate(orderListByUserid);
	} catch (error) {
		console.log(error);
	}
};

// 判断用户余额是否异常
const correctBalance = async () => {
	const userList = await userModel.findAll();
	let num = 0;
	userList.forEach(async item => {
		const userid = item.id;
		const balance = item.balance;
		// if (userid !== 87) return;
		let totalMoney = 0; // 总充值金额
		let consumeMoney = 0; // 总消费金额
		if (item.member === 1) return;
		// 总共充值金额
		const payMontyList = await billModel.findAll({ where: { userid, type: ['recharge', 'member'] } });
		payMontyList.forEach(m => {
			totalMoney += Number(m.money);
			totalMoney += Number(m.send);
		});
		if (totalMoney === 0) return;
		const consumeList = await billModel.findAll({
			where: {
				pay_type: 'account',
				userid,
			},
		});
		consumeList.forEach(m => {
			consumeMoney += Number(m.money);
		});
		let shouldMoney = Number(Number(totalMoney) - Number(consumeMoney)).toFixed(2);
		if (balance !== shouldMoney) {
			num++;
			console.log('+++++++++++++');
			console.log();
			console.log(
				`userid: ${item.id} name: ${item.username} 总充值：${totalMoney} 消费：${consumeMoney} 目前剩余：${balance} 应该剩余：${shouldMoney}`,
			);
			if (shouldMoney < 0) shouldMoney = 0;
			console.log(`UPDATE \`user\` SET balance = ${shouldMoney} where id=${item.id};`);
			const statement = `UPDATE \`user\` SET balance = ${shouldMoney} where id=${item.id};`;
			sequelize.query(statement, { type: sequelize.QueryTypes.UPDATE });
		}
	});
	if (num === 0) {
		console.log('暂无异常记录');
	} else {
		console.log(`共有${num}条异常记录`);
	}
};

// 将订单同步到支付记录
// eslint-disable-next-line no-unused-vars
const syncBill = async () => {
	const orderList = await orderModel.findAll({ where: { status: 5 } });
	const billList = await billModel.findAll();
	const bulkData = [];
	const orderIds = [];
	orderList.forEach(item => {
		if (!item.userid) return;
		MoneyUtil.countMoney(item);
		const sameBill = billList.filter(bl => String(bl.orderid) === String(item.id));
		// order_type: 1-通过柜子下单 2-上门取衣 3-积分兑换 4-店员录入订单 5-店内下单
		// 通过柜子下单
		// if (item.order_type === 1) {
		// 	const pay_save = sameBill.filter(bl => bl.type === 'save_clothing');
		// 	if (!pay_save || pay_save.length === 0) {
		// 		bulkData.push({
		// 			code: item.code,
		// 			userid: item.userid,
		// 			orderid: item.id,
		// 			money: 1,
		// 			send: 0.0,
		// 			pay_type: 'account',
		// 			type: 'save_clothing',
		// 			// create_time: item.create_time,
		// 			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
		// 		});
		// 	}
		// }
		// 预约上门取衣
		if (item.order_type === 2) {
			const pay_getbill = sameBill.filter(bl => bl.type === 'clothing');
			if (!pay_getbill || pay_getbill.length === 0) {
				bulkData.push({
					code: item.code,
					userid: item.userid,
					orderid: item.id,
					money: 9.9,
					send: 0.0,
					pay_type: 'account',
					type: 'clothing',
					update_type: 2,
					// create_time: item.create_time,
					create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				});
			}
		}
		// 店员录入订单和店内下单不产生额外费用
		const pay_orderbill = sameBill.filter(bl => bl.type === 'order');
		if (!pay_orderbill || pay_orderbill.length === 0) {
			bulkData.push({
				code: item.code,
				userid: item.userid,
				orderid: item.id,
				money: Number(item.payMoney),
				send: 0.0,
				pay_type: 'account',
				type: 'order',
				update_type: 2,
				// create_time: item.create_time,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
		}
		orderIds.push(item.id);
		// bulkData.push({
		// 	code: item.code,
		// 	userid: item.userid,
		// 	orderid: item.id,
		// 	money: Number(item.payMoney) + Number(item.send_money),
		// 	send: 0.0,
		// 	pay_type: 'account',
		// 	type: 'order',
		// 	create_time: item.create_time,
		// });
	});
	await billModel.bulkCreate(bulkData);
	if (bulkData.length === 0) {
		console.log('暂无更新账单记录');
	} else {
		console.log(`同步的id: ${orderIds}`);
		console.log('同步完成');
	}
	correctBalance();
};

// 找出未支付订单，短信通知
const seachNotPayOrders = async () => {
	const ordersList = await orderModel.findAll({ where: { status: [3, 4] } });
	ordersList.forEach(async item => {
		const nowTime = moment().format(timeFormat);
		const create_time = moment(item.create_time).format(timeFormat);
		const diffDays = moment(new Date()).diff(moment(item.create_time), 'days');
		if (diffDays > 7) {
			const userDetail = await userModel.findOne({ where: { id: item.userid } });
			console.log(
				`userid: ${userDetail.id} name: ${userDetail.username} orderid: ${item.id} 相差: ${diffDays} 创建时间: ${create_time} 现在时间: ${nowTime}`,
			);
		}
		console.log(item.id);
		console.log(`orderid: ${item.id} 相差: ${diffDays} 创建时间: ${create_time} 现在时间: ${nowTime}`);
	});
};

// 每天进行消费记录统计
schedule.scheduleJob('1 1 2 * * *', async () => {
	// schedule.scheduleJob('1-59 * * * * *', async () => {
	console.log(`消费记录开始更新：${moment().format(timeFormat)}`);
	await searchOrders(1);
	await searchOrders(2);
	console.log(`消费记录更新完毕：${moment().format(timeFormat)}`);
});

// 每天凌晨1点进行数据库备份
schedule.scheduleJob('1 1 1 * * *', async () => {
	// schedule.scheduleJob('1-59 * * * * *', async () => {
	console.log('开始备份数据');
	console.log(
		`mysqldump -u${sqlConfig.username} -p${sqlConfig.password} ${sqlConfig.database} > ~/database/${moment().format(sqlFormat)}.sql`,
	);
	shelljs.exec(
		`mysqldump -u${sqlConfig.username} -p${sqlConfig.password} ${sqlConfig.database} > ~/database/${moment().format(sqlFormat)}.sql`,
	);
	console.log('备份结束');
});

// 每天凌晨3点进行金额校验
schedule.scheduleJob('1 1 3 * * *', async () => {
	syncBill();
});

// 每天18点，通知未支付用户完成订单
schedule.scheduleJob('* * 18 * * *', async () => {
	seachNotPayOrders();
});
