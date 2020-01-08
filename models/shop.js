/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("shop", {
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
		phone: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		address: {
			type: Sequelize.STRING(500),
			allowNull: true,
			defaultValue: "地址"
		},
		sn: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		key: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		campus: {
			type: Sequelize.STRING(45),
			allowNull: true,
			defaultValue: "北京大学"
		},
		sales: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "0"
		},
		desc: {
			type: Sequelize.STRING(45),
			allowNull: true,
			defaultValue: "地址"
		},
		start_price: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			defaultValue: "0"
		},
		send_price: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			defaultValue: "0"
		},
		special: {
			type: Sequelize.STRING(800),
			allowNull: true
		},
		start_time: {
			type: Sequelize.STRING(255),
			allowNull: true,
			defaultValue: "00:00"
		},
		end_time: {
			type: Sequelize.STRING(255),
			allowNull: true,
			defaultValue: "23:59"
		},
		status: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		invite: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		sort: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		auto_print: {
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
		tableName: "shop",
		timestamps: false
	});
};
