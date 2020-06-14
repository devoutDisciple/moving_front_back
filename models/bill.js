/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'bill',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			code: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			userid: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			orderid: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			money: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: '0',
			},
			is_add: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			pay_type: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			method: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'bill',
			timestamps: false,
		},
	);
};
