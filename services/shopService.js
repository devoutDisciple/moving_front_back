const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const shop = require("../models/shop");
const shopModel = shop(sequelize);

module.exports = {
	// 获取所有的门店列表
	getAll: async (req, res) => {
		try {
			// 查询是否注册过
			let shops = await shopModel.findAll({
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["sort", "DESC"],
				]
			});
			res.send(resultMessage.success(shops));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
