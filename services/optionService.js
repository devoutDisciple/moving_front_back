const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const options = require("../models/options");
const OptionsModel = options(sequelize);
const moment = require("moment");

module.exports = {

	// 增加意见
	add: async (req, res) => {
		try {
			let body = req.body;
			await OptionsModel.create({
				openid: body.openid,
				text: body.text,
				create_time: moment(new Date().getTime()).add(8, "h").format("YYYY-MM-DD HH:mm:ss")
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},


};
