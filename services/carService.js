const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const car = require("../models/car");
const carModel = car(sequelize);
const goods = require("../models/goods");
const GoodsModel = goods(sequelize);
carModel.belongsTo(GoodsModel, { foreignKey: "goods_id", targetKey: "id", as: "goodsDetail",});
const shop = require("../models/shop");
const ShopModel = shop(sequelize);
carModel.belongsTo(ShopModel, { foreignKey: "shop_id", targetKey: "id", as: "shopDetail",});

module.exports = {

	// 添加购物车
	addCarGoods: async (req, res) => {
		let body = req.body;
		body.campus = body.position;
		try {
			let originCarItem = await carModel.findOne({
				where: {
					openid: body.openid,
					goods_id: body.goods_id,
				},
			});
			if(originCarItem) {
				await carModel.increment(["num"], {
					by: 1,
					where: {
						id: originCarItem.id
					}
				});
				return res.send(resultMessage.success([]));
			}
			await carModel.create(body);
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除购物车
	delteItem: async (req, res) => {
		let body = req.body;
		try {
			await carModel.destroy({
				where: {
					id: body.id,
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 批量删除
	deleteMany: async (req, res) => {
		let body = req.body;
		try {
			let orderIdList = body.orderIdList;
			orderIdList.map(async (item) => {
				await carModel.destroy({
					where: {
						id: item,
					}
				});
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据openid获取购物车信息
	getByOpenid: async (req, res) => {
		let openid = req.query.openid;
		try {
			let car = await carModel.findAll({
				where: {
					openid: openid,
					campus: req.query.position
				},
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}, {
					model: ShopModel,
					as: "shopDetail",
				}],
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				]
			});
			let result = [];
			car.map(item => {
				result.push({
					id: item.id,
					goodsid: item.goods_id,
					goodsName: item.goodsDetail.name,
					shopid: item.shop_id,
					shopName: item.shopDetail.name,
					num: item.num,
					price: item.price,
					package_cost: item.goodsDetail.package_cost,
					url: item.goodsDetail.url,
					send_price: item.shopDetail.send_price,
					leave: item.goodsDetail.leave,
					start_time: item.shopDetail.start_time,
					end_time: item.shopDetail.end_time,
					shopStatus: item.shopDetail.status,
					specification: item.specification,
					start_price: item.shopDetail.start_price
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 修改购物车商品的数量
	modifyNum: async (req, res) => {
		let id = req.body.id, num = req.body.num;
		try {
			await carModel.increment(["num"], {
				by: num,
				where: {
					id: id
				}
			});
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据openid获取购物车数量
	getCarNumByOpenid: async (req, res) => {
		let openid = req.query.openid;
		try {
			let car = await carModel.count({
				where: {
					openid: openid,
					campus: req.query.position
				}
			});
			res.send(resultMessage.success(car));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

};
