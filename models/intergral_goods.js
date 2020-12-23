/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'intergral_goods',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			shopid: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			desc: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			url: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			intergral: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: '100',
			},
			sort: {
				type: Sequelize.INTEGER(255),
				allowNull: true,
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			is_delete: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'intergral_goods',
			timestamps: false,
		},
	);
};
