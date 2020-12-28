/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'ranking',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userid: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			username: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			photo: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			money: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			discount: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
			},
			orderids: {
				type: Sequelize.STRING(5000),
				allowNull: true,
				defaultValue: '[]',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			type: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'ranking',
			timestamps: false,
		},
	);
};
