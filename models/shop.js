/* jshint indent: 2 */

const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'shop',
		{
			id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: Sequelize.STRING(45),
				allowNull: false,
			},
			manager: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			phone: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			address: {
				type: Sequelize.STRING(500),
				allowNull: true,
				defaultValue: '浙江省杭州市余杭区五常街道西溪水岸花苑',
			},
			url: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			longitude: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '120.050247',
			},
			latitude: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '30.282795',
			},
			sn: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			key: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			sales: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '0',
			},
			desc: {
				type: Sequelize.STRING(45),
				allowNull: true,
			},
			special: {
				type: Sequelize.STRING(800),
				allowNull: true,
			},
			invite: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
			},
			sort: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			auto_print: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
			is_delete: {
				type: Sequelize.INTEGER(11),
				allowNull: true,
				defaultValue: '1',
			},
		},
		{
			tableName: 'shop',
			timestamps: false,
		},
	);
};
