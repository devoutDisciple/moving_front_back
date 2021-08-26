const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const advertising = require('../models/advertising');

const advertisingModel = advertising(sequelize);

module.exports = {
	// 获取列表
	getList: async (req, res) => {
		try {
			const { shopid } = req.query;
			const condition = {
				where: { is_delete: 1 },
				order: [
					['sort', 'DESC'],
					['create_time', 'DESC'],
				],
			};
			if (shopid && String(shopid) !== '-1') {
				condition.where.shopid = Number(shopid);
			}
			const advers = await advertisingModel.findAll(condition);
			res.send(resultMessage.success(advers));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
