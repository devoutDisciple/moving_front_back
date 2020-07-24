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
			code: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			shopid: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			userid: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			order_type: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: '1',
			},
			goods: {
				type: Sequelize.STRING(8000),
				allowNull: true,
			},
			send_people: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			cabinetId: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			boxid: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			cellid: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			home_address: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			home_username: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			home_phone: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			home_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			intergral_address: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			intergral_username: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			intergral_phone: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			intergral_num: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			is_sure: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			pre_pay: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			send_money: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			origin_money: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			money: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			discount: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '100',
			},
			desc: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			send_status: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			status: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			modify_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			is_delete: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'order',
			timestamps: false,
		},
	);
};
