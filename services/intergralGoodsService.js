const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const intergral = require('../models/intergral_goods');
const intergralModel = intergral(sequelize);

module.exports = {
	// 根据商店id获取积分商品
	getAllById: async (req, res) => {
		try {
			let id = req.query.id;
			let intergrals = await intergralModel.findAll({
				where: {
					shopid: id,
				},
				order: [['sort', 'DESC']],
			});
			res.send(resultMessage.success(intergrals));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
