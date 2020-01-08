const resultMessage = require("../util/resultMessage");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("../dataSource/MysqlPoolClass");
const campus = require("../models/campus");
const CampusModel = campus(sequelize);

module.exports = {
	getAll: async (req, res) => {
		try {
			let type = await CampusModel.findAll({
				where: {
					is_delete: {
						[Op.not]: ["2"]
					}
				},
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["sort", "DESC"],
				]
			});
			let result = [];
			type.map(item => {
				result.push(item.dataValues);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	}
};
