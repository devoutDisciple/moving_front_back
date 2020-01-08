/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("goods", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING(45),
			allowNull: false
		},
		position: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		title: {
			type: Sequelize.STRING(800),
			allowNull: true
		},
		url: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		desc: {
			type: Sequelize.STRING(8000),
			allowNull: true
		},
		sales: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "0"
		},
		price: {
			type: Sequelize.STRING(11),
			allowNull: true,
			defaultValue: "0"
		},
		shopid: {
			type: Sequelize.STRING(45),
			allowNull: false
		},
		package_cost: {
			type: Sequelize.STRING(45),
			allowNull: true
		},
		specification: {
			type: Sequelize.STRING(800),
			allowNull: true
		},
		today: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "2"
		},
		sort: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		leave: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		show: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		is_delete: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		}
	}, {
		tableName: "goods",
		timestamps: false
	});
};
