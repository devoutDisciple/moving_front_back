/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'options',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userid: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			option: {
				type: Sequelize.STRING(800),
				allowNull: true,
			},
			desc: {
				type: Sequelize.STRING(800),
				allowNull: true,
			},
			status: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'options',
			timestamps: false,
		},
	);
};
