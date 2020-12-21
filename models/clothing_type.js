/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'clothing',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
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
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		},
		{
			tableName: 'clothing_type',
			timestamps: false,
		},
	);
};
