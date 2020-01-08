const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const order = require("../models/order");
const orderModel = order(sequelize);
const shop = require("../models/shop");
const ShopModel = shop(sequelize);
const moment = require("moment");
orderModel.belongsTo(ShopModel, { foreignKey: "shopid", targetKey: "id", as: "shopDetail",});
const goods = require("../models/goods");
const goodsModel = goods(sequelize);
let printService = require("./printService");

module.exports = {
	// 增加订单
	addOrder: async (req, res) => {
		try {
			let data = req.body.data;
			// body.order_time = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss");
			// let data = body.data;
			data.map(item => {
				item.order_time = moment(new Date().getTime()).add(8, "h").format("YYYY-MM-DD HH:mm:ss");
				item.openid = req.body.openid;
				let orderList = item.oder_list;
				orderList = JSON.parse(item.order_list) || [];
				orderList.map(async (order )=> {
					await goodsModel.increment(["sales"], {
						by: order.num,
						where: {
							id: order.goodsid
						}
					});
				});
			});
			let result = await orderModel.bulkCreate(data);
			await result.map(async (item) => {
				await printService.printOrder(item.id);
			});
			return res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取订单
	getListByOpenid: async (req, res) => {
		let openid = req.query.openid, type = req.query.type;
		let params = {
			where: {
				openid: openid
			},
			order: [
				// will return `name`  DESC 降序  ASC 升序
				["order_time", "DESC"],
			],
			include: [{
				model: ShopModel,
				as: "shopDetail",
			}],
		};
		if(type == 2) params.where.status =  3; // 待评价
		if(type == 3) params.where.status =  [6, 7, 8]; // 退款中
		try {
			let list = await orderModel.findAll(params);
			let result = [];
			list.map(item => {
				result.push({
					id: item.id,
					desc: item.desc,
					order_list: JSON.parse(item.order_list) || [],
					discount_price: item.discount_price,
					order_time: item.order_time,
					shopid: item.shopid,
					shopName: item.shopDetail ? item.shopDetail.name : "",
					status: item.status,
					total_price: item.total_price,
					package_cost: item.package_cost,
					send_price: item.send_price
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 更改订单状态
	updateOrderStatus: async (req, res) => {
		let body = req.body;
		try {
			await orderModel.update({status: body.status}, {
				where: {
					id: body.id
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 通过订单id获取订单
	getOrderById: async (req, res) => {
		try {
			let id = req.query.id;
			let order = await orderModel.findOne({
				where: {
					id: id
				},
				include: [{
					model: ShopModel,
					as: "shopDetail",
				}],
			});
			let obj = {
				"id": order.id,
				"openid": order.opnid,
				"people": order.people,
				"phone": order.phone,
				"address": order.address,
				"shopid": order.shopid,
				"order_list": order.order_list,
				"send_price": order.send_price,
				"package_cost": order.package_cost,
				"total_price": order.total_price,
				"discount_price": order.discount_price,
				"desc": order.desc,
				"print": order.print,
				"status": order.status,
				"order_time": order.order_time,
				"is_delete": order.is_delete,
				"shopPhone": order.shopDetail ? order.shopDetail.phone : ""
			};
			res.send(resultMessage.success(obj));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 更改订单的状态
	updateStatus: async (req, res, params) => {
		// let body = req.body;
		try {
			// await evaluateModel.create(body);
			await orderModel.update({status: params.status}, {
				where: {
					id: params.orderid
				}
			});
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
