/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("securityCode", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		phone: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		security_code: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		create_time: {
			type: Sequelize.DATE,
			allowNull: false
		},
		expire_time: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		tableName: "securityCode",
		timestamps: false
	});
};
