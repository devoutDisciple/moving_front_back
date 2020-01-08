const resultMessage = require("../util/resultMessage");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("../dataSource/MysqlPoolClass");
const shop = require("../models/shop");
const ShopModel = shop(sequelize);

module.exports = {
	// 获取所有商店列表
	getAll: async (req, res) => {
		try {
			let swiper = await ShopModel.findAll({
				where: {
					is_delete: {
						[Op.not]: ["2"]
					},
					campus: req.query.position
				},
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["sort", "DESC"],
				]
			});
			let result = [];
			swiper.map(item => {
				result.push(item.dataValues);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 通过id获取制定商店
	getById: async (req, res) => {
		let id = req.query.id;
		try {
			let shop = await ShopModel.findOne({
				where: {
					id: id
				}
			});
			res.send(resultMessage.success(shop));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 通过type类型获取商店
	getShopByType: async (req, res) => {
		let id = req.query.id;
		try {
			let shop = await ShopModel.findAll({
				where: {
					typeid: id,
					campus: req.query.position,
					is_delete: {
						[Op.not]: ["2"]
					},
				},
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["sort", "DESC"],
				]
			});
			res.send(resultMessage.success(shop || []));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 根据关键字模糊搜索商店
	getShopByName: async (req, res) => {
		let name = req.query.name;
		try {
			let shops = await ShopModel.findAll({
				where: {
					name: {
						[Op.like]: "%" + name + "%"
					},
					is_delete: {
						[Op.not]: ["2"]
					},
				}
			});
			let result = [];
			shops.map(item => {
				result.push(item.dataValues);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 商店增加销量
	addSales: async (req, res) => {
		let body = req.body;
		let id = body.id;
		try {
			await ShopModel.increment(["sales"], {
				where: {
					id: id
				}
			}).then(() => {
				res.send(resultMessage.success([]));
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
