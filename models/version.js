/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
	return sequelize.define(
		'version',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			version: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			desc: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			current: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			force: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			type: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				defaultValue: '1',
			},
			remark: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
		},
		{
			tableName: 'version',
			timestamps: false,
		},
	);
};
