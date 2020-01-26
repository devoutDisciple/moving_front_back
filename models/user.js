/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("user", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: Sequelize.STRING(255),
			allowNull: false,
			primaryKey: true
		},
		nickname: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		password: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		phone: {
			type: Sequelize.STRING(11),
			allowNull: false,
			primaryKey: true
		},
		photo: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		address: {
			type: Sequelize.STRING(8000),
			allowNull: true
		},
		token: {
			type: Sequelize.STRING(255),
			allowNull: true
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
			allowNull: true
		},
		is_delete: {
			type: Sequelize.STRING(255),
			allowNull: true
		}
	}, {
		tableName: "user",
		timestamps: false
	});
};
