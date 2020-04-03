/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'register',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			phone: {
				type: Sequelize.STRING(11),
				allowNull: false,
				primaryKey: true,
			},
			security_code: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			expire_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'register',
			timestamps: false,
		},
	);
};
