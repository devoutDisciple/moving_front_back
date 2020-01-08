const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const user = require("../models/user");
const userModel = user(sequelize);

module.exports = {
	// 获取广告数据
	getAll: async (req, res) => {
		try {
			let data = await userModel.findOne();
			res.send(resultMessage.success(data));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
