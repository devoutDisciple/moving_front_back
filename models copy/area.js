/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'area',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			parentid: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			level: {
				type: Sequelize.INTEGER(255),
				allowNull: false,
				defaultValue: '1',
			},
			name: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			active: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			sort: {
				type: Sequelize.INTEGER(255),
				allowNull: true,
			},
			is_delete: {
				type: Sequelize.INTEGER(255),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'area',
			timestamps: false,
		},
	);
};
