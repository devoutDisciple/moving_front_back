/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("options", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		openid: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		text: {
			type: Sequelize.STRING(8000),
			allowNull: true
		},
		create_time: {
			type: Sequelize.DATE,
			allowNull: true
		}
	}, {
		tableName: "options",
		timestamps: false
	});
};
