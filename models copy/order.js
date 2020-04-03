/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'order',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			shop_id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			goods: {
				type: Sequelize.STRING(8000),
				allowNull: true,
			},
			money: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: '0',
			},
			send_money: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			send_people: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			desc: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			crate_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			modify_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'order',
			timestamps: false,
		},
	);
};
