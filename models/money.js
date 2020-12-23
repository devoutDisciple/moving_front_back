/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'money',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			money: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			send: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			sort: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'money',
			timestamps: false,
		},
	);
};
