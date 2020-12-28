/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'clothing_type',
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
				allowNull: false,
			},
			url: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			sort: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'clothing_type',
			timestamps: false,
		},
	);
};
