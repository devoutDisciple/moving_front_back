const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const clothingType = require('../models/clothing_type');

const clothingTypeModel = clothingType(sequelize);
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 根据商店获取衣物
	getByShopid: async (req, res) => {
		try {
			const { shopid } = req.query;
			const clothings = await clothingTypeModel.findAll({
				where: { shopid },
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(clothings, ['id', 'shopid', 'name', 'url', 'sort']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
