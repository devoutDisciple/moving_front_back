/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("user", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: Sequelize.STRING(255),
			allowNull: false,
			primaryKey: true
		},
		password: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		phone: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		address: {
			type: Sequelize.STRING(8000),
			allowNull: true
		},
		token: {
			type: Sequelize.STRING(255),
			allowNull: false,
			primaryKey: true
		},
		security_code: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		security_create_time: {
			type: Sequelize.DATE,
			allowNull: true
		},
		security_expire_time: {
			type: Sequelize.DATE,
			allowNull: true
		},
		create_time: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		tableName: "user",
		timestamps: false
	});
};
