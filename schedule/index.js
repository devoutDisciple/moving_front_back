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
		let payMoney = 0; // 总充值金额
		let consumeMoney = 0; // 总消费金额
		if (item.member === 1) return;
		const memberMoneyList = await billModel.findAll({ where: { userid, type: 'member' } });
		const rechargeMoneyList = await billModel.findAll({ where: { userid, type: 'recharge' } });
		memberMoneyList.forEach(m => {
			payMoney += Number(m.money);
			payMoney += Number(m.send);
		});
		rechargeMoneyList.forEach(m => {
			payMoney += Number(m.money);
			payMoney += Number(m.send);
		});
		if (payMoney === 0) return;
		const consumeList = await billModel.findAll({ where: { pay_type: 'account', userid } });
		consumeList.forEach(m => {
			consumeMoney += Number(m.money);
		});
		const shouldMoney = Number(Number(payMoney) - Number(consumeMoney)).toFixed(2);
		if (balance !== shouldMoney) {
			num++;
			console.log('+++++++++++++');
			console.log(
				`userid: ${item.id} name: ${item.username} 总充值：${payMoney} 消费：${consumeMoney} 目前剩余：${balance} 应该剩余：${shouldMoney}`,
			);
			console.log(`UPDATE \`user\` SET balance = ${shouldMoney} where id=${item.id};`);
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
		if (sameBill && sameBill[0]) return;
		orderIds.push(item.id);
		bulkData.push({
			code: item.code,
			userid: item.userid,
			orderid: item.id,
			money: item.payMoney,
			send: 0.0,
			pay_type: 'account',
			type: 'order',
			create_time: item.create_time,
		});
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

schedule.scheduleJob('1 1 2 * * *', async () => {
	// schedule.scheduleJob('1-59 * * * * *', async () => {
	console.log(`日消费记录开始更新：${moment().format(timeFormat)}`);
	await searchOrders(1);
	console.log(`日消费记录更新完毕：${moment().format(timeFormat)}`);
});

schedule.scheduleJob('5 1 2 * * *', async () => {
	// schedule.scheduleJob('1-59 * * * * *', async () => {
	console.log(`月消费记录开始更新：${moment().format(timeFormat)}`);
	await searchOrders(2);
	console.log(`月消费记录跟新完毕：${moment().format(timeFormat)}`);
});

schedule.scheduleJob('1 1 * * * *', async () => {
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

syncBill();

// correctBalance();
