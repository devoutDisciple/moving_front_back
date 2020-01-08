const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const adver = require("../models/adver");
const adverModel = adver(sequelize);
const goods = require("../models/goods");
const GoodsModel = goods(sequelize);
adverModel.belongsTo(GoodsModel, { foreignKey: "goods_id", targetKey: "id", as: "goodsDetail",});
const shop = require("../models/shop");
const ShopModel = shop(sequelize);
adverModel.belongsTo(ShopModel, { foreignKey: "shop_id", targetKey: "id", as: "shopDetail",});

module.exports = {
	// 获取广告数据
	getAll: async (req, res) => {
		try {
			let data = await adverModel.findOne();
			res.send(resultMessage.success(data));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
