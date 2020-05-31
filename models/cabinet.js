/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'cabinet',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			shopid: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			name: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			address: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			boxid: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			url: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			total: {
				type: Sequelize.STRING(800),
				allowNull: true,
				defaultValue: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]',
			},
			used: {
				type: Sequelize.STRING(800),
				allowNull: true,
				defaultValue: '[]',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			sort: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
		},
		{
			tableName: 'cabinet',
			timestamps: false,
		},
	);
};
