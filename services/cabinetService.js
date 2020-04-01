const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const cabinet = require('../models/cabinet');
const CabinetModel = cabinet(sequelize);

module.exports = {
	// 根据商店获取快递柜
	getAllByShop: async (req, res) => {
		try {
			let shopid = req.query.shopid;
			let swipers = await CabinetModel.findAll({
				where: {
					shopid: shopid,
				},
				order: [['sort', 'DESC']],
			});
			res.send(resultMessage.success(swipers));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
