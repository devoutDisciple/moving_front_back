const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const area = require('../models/area');
const responseUtil = require('../util/responseUtil');
const areaModel = area(sequelize);

module.exports = {
	// 获取全部区域
	getAll: async (req, res) => {
		try {
			let areas = await areaModel.findAll({
				order: [
					['level', 'ASC'],
					['sort', 'DESC'],
				],
			});
			let result = responseUtil.renderFieldsAll(areas, ['id', 'name', 'parentid', 'level']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
