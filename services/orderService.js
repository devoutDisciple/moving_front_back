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

const ObjectUtil = require('../util/ObjectUtil');
const cabinetUtil = require('../util/cabinetUtil');

module.exports = {
	// 新增订单
	add: async (req, res) => {
		try {
			let body = req.body;
			let params = {
				shopid: body.shopid,
				code: ObjectUtil.createOrderCode(),
				userid: body.userid,
				goods: body.goods || '[]',
				money: body.money,
				desc: body.desc,
				status: body.status,
				cabinetId: body.cabinetId,
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

	// 分页获取订单
	getOrderByPage: async (req, res) => {
		try {
			let { current = 1, pagesize = 10, userid, type = 'all' } = req.query;
			let status = [1];
			switch (type) {
				case 'all':
					status = [1, 2, 3, 4, 5];
					break;
				case 'cleaning':
					status = [2];
					break;
				case 'receiving':
					status = [3, 4];
					break;
				case 'finished':
					status = [5];
					break;

				default:
					break;
			}
			let offset = CountUtil.getInt((current - 1) * pagesize);
			let orders = await orderModel.findAll({
				where: {
					userid: userid,
					status: status,
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
			let result = responseUtil.renderFieldsAll(orders, ['id', 'shopid', 'goods', 'money', 'desc', 'status', 'create_time']);
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

	// 获取某个订单详情
	getOrderById: async (req, res) => {
		try {
			let order = await orderModel.findOne({
				where: {
					id: req.query.id,
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
			});
			// eslint-disable-next-line
			let result = responseUtil.renderFieldsObj(order, ['id','code','shopid','goods','money','pre_pay','send_money','desc','status','cabinetId','cellid','create_time']);
			result.create_time = moment(result.create_time).format('YYYY-MM-DD HH:mm:ss');
			result.shopName = order.shopDetail ? order.shopDetail.name : '';
			result.shopAddress = order.shopDetail ? order.shopDetail.address : '';
			result.shopManager = order.shopDetail ? order.shopDetail.manager : '';
			result.shopPhone = order.shopDetail ? order.shopDetail.phone : '';
			result.cabinetAddress = order.cabinetDetail ? order.cabinetDetail.address : '';
			result.cabinetUrl = order.cabinetDetail ? order.cabinetDetail.url : '';
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 打开柜子
	openCellById: async (req, res) => {
		try {
			let { orderId } = req.body;
			let order = await orderModel.findOne({
				where: { id: orderId },
			});
			let { cellid, boxid, cabinetId } = order;
			// 获取token
			let boxLoginDetail = await cabinetUtil.getToken();
			boxLoginDetail = JSON.parse(boxLoginDetail);
			let token = boxLoginDetail.data || '';
			if (!token) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			// 打开柜子
			let result = await cabinetUtil.openCellGet(cabinetId, boxid, cellid, token);
			// 打开后可用的格子的数量
			let used = result.used;
			// 更新可用格子状态
			await cabinetModel.update(
				{ used: JSON.stringify(used) },
				{
					where: {
						id: cabinetId,
					},
				},
			);
			// 更新订单状态
			await orderModel.update({ status: 5 }, { where: { id: orderId } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
