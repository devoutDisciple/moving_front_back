/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'address',
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
			username: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			phone: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			sex: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			area: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			street: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			is_defalut: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			is_delete: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'address',
			timestamps: false,
		},
	);
};
