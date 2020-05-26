/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'clothing',
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
			price: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			sort: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		},
		{
			tableName: 'clothing',
			timestamps: false,
		},
	);
};
