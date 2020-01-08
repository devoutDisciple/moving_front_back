const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const collection = require("../models/collection");
const collectionModel = collection(sequelize);
const goods = require("../models/goods");
const GoodsModel = goods(sequelize);
collectionModel.belongsTo(GoodsModel, { foreignKey: "goods_id", targetKey: "id", as: "goodsDetail",});

module.exports = {
	// 添加收藏
	addCollectionGoods: async (req, res) => {
		let body = req.body;
		try {
			let originCarItem = await collectionModel.findOne({
				where: {
					openid: body.openid,
					goods_id: body.goods_id,
				},
			});
			if(originCarItem) {
				return res.send(resultMessage.success("have one"));
			}
			await collectionModel.create(body);
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 根据openid获取收藏信息
	getByOpenid: async (req, res) => {
		let openid = req.query.openid;
		try {
			let car = await collectionModel.findAll({
				where: {
					openid: openid
				},
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}],
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				]
			});
			let result = [];
			car.map(item => {
				result.push(item.dataValues);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 移除收藏
	removeCollectionGoods: async (req, res) => {
		let openid = req.body.openid, goods_id = req.body.goods_id;
		try {
			await collectionModel.destroy({
				where: {
					openid: openid,
					goods_id: goods_id
				}
			});
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
