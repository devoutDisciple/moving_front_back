const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const responseUtil = require('../util/responseUtil');
const money = require('../models/money');

const moneyModel = money(sequelize);

module.exports = {
	// 获取所有支付金额种类
	getAllType: async (req, res) => {
		try {
			const areas = await moneyModel.findAll({
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(areas, ['id', 'money', 'send', 'sort']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
