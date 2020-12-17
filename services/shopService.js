const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const responseUtil = require('../util/responseUtil');
const shop = require('../models/shop');

const shopModel = shop(sequelize);

module.exports = {
	// 获取所有的门店列表
	getAll: async (req, res) => {
		try {
			// 查询是否注册过
			const shops = await shopModel.findAll({
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(shops, ['id', 'name', 'address', 'phone']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 根据id获取商店信息
	getShopById: async (req, res) => {
		try {
			// 查询是否注册过
			const shops = await shopModel.findOne({
				where: { id: req.query.shopid },
			});
			const result = responseUtil.renderFieldsObj(shops, ['id', 'name', 'address', 'phone']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
