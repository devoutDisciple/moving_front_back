const resultMessage = require("../util/resultMessage");
// const sequelize = require("../dataSource/MysqlPoolClass");
// const register = require("../models/register");
// const registerModel = register(sequelize);

module.exports = {
	// 获取广告数据
	register: async (req, res) => {
		try {
			// let data = await registerModel.findAll();
			res.send(resultMessage.success("hello"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
