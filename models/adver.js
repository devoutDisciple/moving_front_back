/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("adver", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		shop_id: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		goods_id: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		status: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		show: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			defaultValue: "2"
		},
		time: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		}
	}, {
		tableName: "adver",
		timestamps: false
	});
};
