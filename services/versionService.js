const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const version = require('../models/version');
const versionModel = version(sequelize);
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 获取当前版本号
	getCurrentVersion: async (req, res) => {
		try {
			let data = await versionModel.findOne({
				where: {
					current: 1,
				},
			});
			let result = responseUtil.renderFieldsObj(data, ['id', 'version', 'desc', 'force']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
