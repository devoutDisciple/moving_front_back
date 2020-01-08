/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("rate", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		shop_rate: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		other_rate: {
			type: Sequelize.STRING(255),
			allowNull: true
		}
	}, {
		tableName: "rate",
		timestamps: false
	});
};
