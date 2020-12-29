const Sequelize = require('sequelize');
const schedule = require('node-schedule');
const moment = require('moment');

const Op = Sequelize.Op;
const shelljs = require('shelljs');
const sequelize = require('../dataSource/MysqlPoolClass');
const order = require('../models/order');
const user = require('../models/user');
const CountUtil = require('../util/CountUtil');
const ranking = require('../models/ranking');
const MoneyUtil = require('../util/MoneyUtil');
const sqlConfig = require('../config/sqlConfig');

const rankingModal = ranking(sequelize);

const orderModel = order(sequelize);
const userModel = user(sequelize);
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const sqlFormat = 'YYYY-MM-DD:HH-mm';

orderModel.belongsTo(userModel, { foreignKey: 'userid', targetKey: 'id', as: 'userDetail' });

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

schedule.scheduleJob('1 1 * * * *', async () => {
	// schedule.scheduleJob('1-59 * * * * *', async () => {
	console.log(`日消费记录开始更新：${moment().format(timeFormat)}`);
	await searchOrders(1);
	console.log(`日消费记录更新完毕：${moment().format(timeFormat)}`);
});

schedule.scheduleJob('5 1 * * * *', async () => {
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
