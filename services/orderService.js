const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const MoneyUtil = require('../util/MoneyUtil');

const order = require('../models/order');

const orderModel = order(sequelize);

const shop = require('../models/shop');

const shopModel = shop(sequelize);
orderModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

const cabinet = require('../models/cabinet');

const cabinetModel = cabinet(sequelize);
orderModel.belongsTo(cabinetModel, { foreignKey: 'cabinetId', targetKey: 'id', as: 'cabinetDetail' });

const account = require('../models/account');

const accountModel = account(sequelize);

const user = require('../models/user');

const userModel = user(sequelize);

const CountUtil = require('../util/CountUtil');
const responseUtil = require('../util/responseUtil');

const ObjectUtil = require('../util/ObjectUtil');
const cabinetUtil = require('../util/cabinetUtil');

const PostMessage = require('../util/PostMessage');
const PrintUtil = require('../util/PrintUtil');

const config = require('../config/AppConfig');

const isThursDay = moment(new Date().getTime()).day() === 4;

module.exports = {
	// 通过洗衣柜下单
	addByCabinet: async (req, res) => {
		try {
			const { body } = req;
			const code = ObjectUtil.createOrderCode();
			const params = {
				shopid: body.shopid,
				code,
				userid: body.userid,
				goods: body.goods || '[]',
				origin_money: body.money,
				money: body.money,
				desc: body.desc,
				status: body.status,
				cabinetId: body.cabinetId,
				boxid: body.boxid,
				cellid: body.cellid,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				is_sure: 1,
				discount: isThursDay ? 8.5 : 10,
				urgency: body.urgency,
				pre_pay: body.pre_pay || 0,
				order_type: body.order_type,
			};
			const resOrder = await orderModel.create(params);
			res.send(resultMessage.success('success'));
			if (config.send_message_flag === 2) return;
			const shopDetail = await shopModel.findOne({ where: { id: body.shopid } });
			const userDetail = await userModel.findOne({ where: { id: body.userid } });
			// 打印商户订单
			if (shopDetail.sn && resOrder.id) {
				PrintUtil.printOrderByOrderId(resOrder.id);
			}
			// 发送信息给用户
			PostMessage.sendOrderStartToUser(shopDetail.phone);
			// 批量发送信息
			const accountLists = await accountModel.findAll({ where: { shopid: body.shopid } });
			const phoneList = [];
			if (Array.isArray(accountLists)) {
				accountLists.forEach(item => {
					phoneList.push(item.phone);
				});
			}
			PostMessage.sendOrderStartToShopBatch(phoneList, userDetail.username, userDetail.phone);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 店内下单
	addByShopInput: async (req, res) => {
		try {
			const { body } = req;
			const code = ObjectUtil.createOrderCode();
			const params = {
				shopid: body.shopid,
				code,
				userid: body.userid,
				goods: body.goods || '[]',
				origin_money: body.money,
				money: body.money,
				desc: body.desc,
				status: 2,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				is_sure: 1,
				send_status: body.send_status,
				urgency: body.urgency,
				discount: isThursDay ? 8.5 : 10,
				pre_pay: 0,
				order_type: 5,
			};
			const resOrder = await orderModel.create(params);
			res.send(resultMessage.success('success'));
			if (config.send_message_flag === 2) return;
			const shopDetail = await shopModel.findOne({ where: { id: body.shopid } });
			const userDetail = await userModel.findOne({ where: { id: body.userid } });
			// 打印商户订单
			if (shopDetail.sn && resOrder.id) {
				PrintUtil.printOrderByOrderId(resOrder.id);
			}
			// 发送信息给用户
			PostMessage.sendUserShopOrderSuccessToUser(userDetail.phone);
			// 批量发送信息
			const accountLists = await accountModel.findAll({ where: { shopid: body.shopid } });
			const phoneList = [];
			if (Array.isArray(accountLists)) {
				accountLists.forEach(item => {
					phoneList.push(item.phone);
				});
			}
			PostMessage.sendUserShopOrderSuccessToShopBatch(phoneList);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 预约上门取衣
	addByHome: async (req, res) => {
		try {
			const { body } = req;
			const code = ObjectUtil.createOrderCode();
			const params = {
				shopid: body.shopid,
				code,
				userid: body.userid,
				goods: '[]',
				home_username: body.home_username,
				home_phone: body.home_phone,
				home_address: body.home_address,
				desc: body.desc,
				home_time: body.home_time,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				send_money: 0,
				is_sure: 1,
				discount: isThursDay ? 8.5 : 10,
				status: 6, // 预约上门等待店员取货
				urgency: body.urgency,
				order_type: 2, // 山门取衣
			};
			const { id } = await orderModel.create(params);
			res.send(resultMessage.success({ data: id, success: 'success' }));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 预约上门取衣用余额支付
	subMoneyByAccount: async (req, res) => {
		try {
			const { userid, orderid, money } = req.body;
			const userDetail = await userModel.findOne({ where: { id: userid } });
			// 目前账户余额
			const currentBalance = userDetail.balance;
			const updateBalance = Number(Number(currentBalance) - Number(money)).toFixed(2);
			if (updateBalance < 0) {
				return res.send(resultMessage.error('账户余额不足，请充值'));
			}
			// 更新账户余额
			await userModel.update(
				{ balance: updateBalance },
				{
					where: {
						id: userid,
					},
				},
			);
			const currentOrderDetail = await orderModel.findOne({ where: { id: orderid } });
			// 将要更新的状态
			const state = {};
			// 支付取衣费用
			if (currentOrderDetail.status === 6) {
				state.status = 8;
				state.send_money = 9.9;
			}
			// 如果是支付订单金额,如果是存放在柜子里
			if (currentOrderDetail.status === 3 && currentOrderDetail.cabinetId) {
				if (currentOrderDetail.boxid && currentOrderDetail.cellid) state.status = 4;
			}

			// 如果是支付订单金额,此时订单已经派送到用户手中
			if (currentOrderDetail.status === 3 && currentOrderDetail.send_home === 2) {
				if (!currentOrderDetail.cabinetId && !currentOrderDetail.boxid) state.status = 5;
			}
			// 更新订单状态
			await orderModel.update(state, { where: { id: orderid } });
			res.send(resultMessage.success('success'));

			if (config.send_message_flag === 2) return;
			// 发送信息给用户
			const orderDetail = await orderModel.findOne({ where: { id: orderid } });
			PostMessage.sendMessageGetClothingSuccessToUser(orderDetail.home_phone);

			// 批量发送消息
			const shopid = orderDetail.id;
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
				where: { id: orderid },
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
				],
			});
			if (result.shopDetail.sn && orderid) {
				PrintUtil.printOrderByOrderId(orderid);
			}
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 积分兑换
	addByIntergral: async (req, res) => {
		try {
			const { body } = req;
			const code = ObjectUtil.createOrderCode();
			const params = {
				shopid: body.shopid,
				code,
				userid: body.userid,
				goods: body.goods,
				intergral_address: body.intergral_address,
				intergral_phone: body.intergral_phone,
				intergral_username: body.intergral_username,
				intergral_num: body.intergral_num,
				is_sure: 1,
				status: 7, // 预约上门等待店员取货
				order_type: 3, // 积分兑换
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			const userDetail = await userModel.findOne({ where: { id: body.userid } });
			if (!userDetail) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			if (Number(userDetail.integral) < Number(body.intergral_num)) return res.send(resultMessage.error('兑换失败,您的积分不足'));
			const resOrder = await orderModel.create(params);
			const currentIntergral = Number(userDetail.integral) - Number(body.intergral_num);
			await userModel.update(
				{ integral: currentIntergral },
				{
					where: { id: body.userid },
				},
			);
			res.send(resultMessage.success('success'));

			if (config.send_message_flag === 2) return;
			const goods = JSON.parse(body.goods) || {};
			// 发送信息给用户
			PostMessage.sendMessageIntergralGoodsSuccessToUser(userDetail.phone, goods.name || 'MOVING积分商品');
			// 批量发送信息
			const accountLists = await accountModel.findAll({ where: { shopid: body.shopid } });
			const phoneList = [];
			if (Array.isArray(accountLists)) {
				accountLists.forEach(item => {
					phoneList.push(item.phone);
				});
			}
			PostMessage.sendMessageIntergralGoodsSuccessToShopBatch(phoneList);

			// 打印商户订单
			const shopDetail = await shopModel.findOne({ where: { id: body.shopid } });
			if (shopDetail.sn && resOrder.id) {
				PrintUtil.printOrderByOrderId(resOrder.id);
			}
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 分页获取订单
	getOrderByPage: async (req, res) => {
		try {
			const { current = 1, pagesize = 10, userid, type = 'all' } = req.query;
			let status = [1];
			switch (type) {
				case 'all':
					status = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
			const offset = CountUtil.getInt((current - 1) * pagesize);
			const orders = await orderModel.findAll({
				where: {
					userid,
					status,
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
			const result = responseUtil.renderFieldsAll(orders, [
				'id',
				'shopid',
				'goods',
				'money',
				'desc',
				'status',
				'discount',
				'urgency',
				'is_sure',
				'send_status',
				'send_home',
				'create_time',
				'order_type',
			]);
			result.forEach((item, index) => {
				item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				item.shopName = orders[index].shopDetail ? orders[index].shopDetail.name || '' : '';
				item.cabinetUrl = orders[index].cabinetDetail ? orders[index].cabinetDetail.url || '' : '';
				item.cabinetName = orders[index].cabinetDetail ? orders[index].cabinetDetail.name || '' : '';
				item.cabinetAdderss = orders[index].cabinetDetail ? orders[index].cabinetDetail.address || '' : '';
				item.send_stattus = orders[index] ? orders[index].send_stattus || '' : '';
				MoneyUtil.countMoney(item);
				// 上门取衣
				if (item.order_type === 2) {
					item.home_address = orders[index] ? orders[index].home_address || '' : '';
					item.home_username = orders[index] ? orders[index].home_username || '' : '';
					item.home_phone = orders[index] ? orders[index].home_phone || '' : '';
					item.home_time = orders[index] ? moment(orders[index].home_time).format('YYYY-MM-DD HH:mm:ss') || '' : '';
				}
				// 积分兑换
				if (item.order_type === 3) {
					item.intergral_address = orders[index] ? orders[index].intergral_address || '' : '';
					item.intergral_phone = orders[index] ? orders[index].intergral_phone || '' : '';
					item.intergral_username = orders[index] ? orders[index].intergral_username || '' : '';
					item.intergral_num = orders[index] ? orders[index].intergral_num || '' : '';
				}
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
			const { id } = req.query;
			const orderDetail = await orderModel.findOne({
				where: { id },
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
			const result = responseUtil.renderFieldsObj(order, [
				'id',
				'code',
				'shopid',
				'goods',
				'discount',
				'origin_money',
				'money',
				'pre_pay',
				'send_money',
				'desc',
				'urgency',
				'status',
				'order_type',
				'send_status',
				'send_home',
				'cabinetId',
				'cellid',
				'is_sure',
				'create_time',
			]);
			result.create_time = moment(result.create_time).format('YYYY-MM-DD HH:mm:ss');
			result.shopName = orderDetail.shopDetail ? orderDetail.shopDetail.name : '';
			result.shopAddress = orderDetail.shopDetail ? orderDetail.shopDetail.address : '';
			result.shopManager = orderDetail.shopDetail ? orderDetail.shopDetail.manager : '';
			result.shopPhone = orderDetail.shopDetail ? orderDetail.shopDetail.phone : '';
			result.cabinetAddress = orderDetail.cabinetDetail ? orderDetail.cabinetDetail.address : '';
			result.cabinetName = orderDetail.cabinetDetail ? orderDetail.cabinetDetail.name : '';
			result.cabinetUrl = orderDetail.cabinetDetail ? orderDetail.cabinetDetail.url : '';
			MoneyUtil.countMoney(result);
			// 上门取衣
			if (result.order_type === 2) {
				result.home_address = orderDetail ? orderDetail.home_address || '' : '';
				result.home_username = orderDetail ? orderDetail.home_username || '' : '';
				result.home_phone = orderDetail ? orderDetail.home_phone || '' : '';
				result.home_time = orderDetail ? moment(orderDetail.home_time).format('YYYY-MM-DD HH:mm:ss') || '' : '';
			}
			// 积分兑换
			if (result.order_type === 3) {
				result.intergral_address = orderDetail ? orderDetail.intergral_address || '' : '';
				result.intergral_phone = orderDetail ? orderDetail.intergral_phone || '' : '';
				result.intergral_username = orderDetail ? orderDetail.intergral_username || '' : '';
				result.intergral_num = orderDetail ? orderDetail.intergral_num || '' : '';
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 更改订单状态 updateOrderStatus
	updateOrderStatus: async (req, res) => {
		try {
			const { orderid, status } = req.body;
			await orderModel.update({ status }, { where: { id: orderid } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 取消订单
	cancleOrder: async (req, res) => {
		try {
			const { orderid } = req.body;
			await orderModel.destroy({ where: { id: orderid } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 打开柜子
	openCellById: async (req, res) => {
		try {
			const { orderId } = req.body;
			const orderDetail = await orderModel.findOne({
				where: { id: orderId },
			});
			const { cellid, boxid, cabinetId } = orderDetail;
			// 获取token
			let boxLoginDetail = await cabinetUtil.getToken();
			boxLoginDetail = JSON.parse(boxLoginDetail);
			const token = boxLoginDetail.data || '';
			if (!token) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			// 打开柜子
			const result = await cabinetUtil.openCellGet(cabinetId, boxid, cellid, token);
			// 打开后可用的格子的数量
			const { used } = result;
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
