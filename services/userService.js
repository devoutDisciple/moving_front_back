const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const user = require("../models/user");
const userModel = user(sequelize);

module.exports = {
	// 根据token获取当前用户信息
	getUserByToken:async (req, res) => {
		try {
			let token = req.query.token;
			let data = await userModel.findOne({
				where: {
					token: token
				}
			});
			res.send(resultMessage.success(data));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
