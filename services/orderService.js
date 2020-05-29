const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const order = require('../models/order');
const orderModel = order(sequelize);

const shop = require('../models/shop');
const shopModel = shop(sequelize);
orderModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

const cabinet = require('../models/cabinet');
const cabinetModel = cabinet(sequelize);
orderModel.belongsTo(cabinetModel, { foreignKey: 'cabinetId', targetKey: 'id', as: 'cabinetDetail' });

const moment = require('moment');
const CountUtil = require('../util/CountUtil');
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 新增订单
	add: async (req, res) => {
		try {
			let body = req.body;
			let params = {
				shopid: body.shopid,
				userid: body.userid,
				goods: body.goods,
				money: body.money,
				desc: body.desc,
				status: body.status,
				boxid: body.boxid,
				cellid: body.cellid,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			await orderModel.create(params);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	getOrderByPage: async (req, res) => {
		try {
			let { current = 1, pagesize = 10, userid } = req.query;
			let offset = CountUtil.getInt((current - 1) * pagesize);
			console.log(pagesize, offset);
			let orders = await orderModel.findAll({
				where: {
					userid: userid,
				},
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
					{
						model: cabinetModel,
						as: 'cabinetDetail',
					},
				],
				order: [['create_time', 'DESC']],
				limit: Number(pagesize),
				offset: Number(offset),
			});
			let result = responseUtil.renderFieldsAll(orders, ['id', 'goods', 'money', 'desc', 'status', 'create_time']);
			console.log(result[0]);
			result.forEach((item, index) => {
				item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				item.shopName = orders[index]['shopDetail'] ? orders[index]['shopDetail']['name'] || '' : '';
				item.cabinetUrl = orders[index]['cabinetDetail'] ? orders[index]['cabinetDetail']['url'] || '' : '';
				item.cabinetName = orders[index]['cabinetDetail'] ? orders[index]['cabinetDetail']['name'] || '' : '';
				item.cabinetAdderss = orders[index]['cabinetDetail'] ? orders[index]['cabinetDetail']['address'] || '' : '';
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
