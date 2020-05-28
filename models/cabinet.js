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
