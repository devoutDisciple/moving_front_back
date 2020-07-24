/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'intergral_record',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userid: {
				type: Sequelize.STRING(255),
				allowNull: false,
				primaryKey: true,
			},
			shopid: {
				type: Sequelize.STRING(255),
				allowNull: false,
				primaryKey: true,
			},
			goodsId: {
				type: Sequelize.STRING(255),
				allowNull: false,
				primaryKey: true,
			},
			address: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			intergral: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			cabinetId: {
				type: Sequelize.STRING(255),
				allowNull: true,
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
		},
		{
			tableName: 'intergral_record',
			timestamps: false,
		},
	);
};
