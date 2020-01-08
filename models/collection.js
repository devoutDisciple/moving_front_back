/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("collection", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		goods_id: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		openid: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		create_time: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		is_delete: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		}
	}, {
		tableName: "collection",
		timestamps: false
	});
};
