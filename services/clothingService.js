const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const clothing = require('../models/clothing');

const ClothingModel = clothing(sequelize);
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 根据商店获取衣物
	getByShopid: async (req, res) => {
		try {
			const shopid = req.query.shopid;
			const clothings = await ClothingModel.findAll({
				where: {
					shopid,
				},
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(clothings, ['id', 'shopid', 'name', 'price']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
