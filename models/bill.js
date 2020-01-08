/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("bill", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		code: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		shop_id: {
			type: Sequelize.INTEGER(11),
			allowNull: false
		},
		type: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			defaultValue: "1"
		},
		account: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		phone: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		money: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		our_money: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		other_money: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		real_money: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		status: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		create_time: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: "CURRENT_TIMESTAMP(6)"
		},
		modify_time: {
			type: Sequelize.DATE,
			allowNull: true
		}
	}, {
		tableName: "bill",
		timestamps: false
	});
};
