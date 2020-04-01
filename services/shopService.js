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
			let shops = await shopModel.findAll({
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(shops, ['id', 'name', 'address', 'phone']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
