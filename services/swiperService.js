const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const swiper = require("../models/swiper");
const swiperModel = swiper(sequelize);

module.exports = {
	// 获取所有的门店列表
	getAllById: async (req, res) => {
		try {
			let id = req.query.id;
			// 查询是否注册过
			let shops = await swiperModel.findAll({
				where: {
					shop_id: id
				},
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
