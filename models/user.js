/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'user',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			nickname: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			username: {
				type: Sequelize.STRING(255),
				allowNull: false,
				primaryKey: true,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			phone: {
				type: Sequelize.STRING(11),
				allowNull: false,
				primaryKey: true,
			},
			photo: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			address: {
				type: Sequelize.STRING(8000),
				allowNull: true,
			},
			age: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '20',
			},
			email: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			sex: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			token: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			security_code: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			security_create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			security_expire_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			cabinet_use_time: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '0',
			},
			balance: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			integral: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			member: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			is_delete: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'user',
			timestamps: false,
		},
	);
};
