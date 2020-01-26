/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("shop", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		address: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		phone: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		create_time: {
			type: Sequelize.DATE,
			allowNull: true
		},
		modify_time: {
			type: Sequelize.DATE,
			allowNull: true
		},
		is_delete: {
			type: Sequelize.STRING(255),
			allowNull: true,
			defaultValue: "1"
		}
	}, {
		tableName: "shop",
		timestamps: false
	});
};
