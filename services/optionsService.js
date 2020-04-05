const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const options = require('../models/options');
const moment = require('moment');
const optionsModel = options(sequelize);

module.exports = {
	// 新增用户意见
	add: async (req, res) => {
		try {
			let body = req.body;
			body.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
			await optionsModel.create(body);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
