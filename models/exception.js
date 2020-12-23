/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'exception',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			success: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			result: {
				type: Sequelize.STRING(8000),
				allowNull: true,
			},
			optid: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			user_type: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			cabinetid: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			boxid: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			cellid: {
				type: Sequelize.STRING(11),
				allowNull: true,
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		},
		{
			tableName: 'exception',
			timestamps: false,
		},
	);
};
