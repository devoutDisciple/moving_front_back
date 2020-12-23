/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
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
				allowNull: false,
				primaryKey: true,
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
			send: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			pay_type: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			type: {
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
