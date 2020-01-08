/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = function(sequelize) {
	return sequelize.define("swiper", {
		id: {
			type: Sequelize.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		type: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		},
		shopid: {
			type: Sequelize.STRING(45),
			allowNull: true
		},
		goodsid: {
			type: Sequelize.INTEGER(11),
			allowNull: true
		},
		campus: {
			type: Sequelize.STRING(45),
			allowNull: true
		},
		sort: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "0"
		},
		is_delete: {
			type: Sequelize.INTEGER(11),
			allowNull: true,
			defaultValue: "1"
		}
	}, {
		tableName: "swiper",
		timestamps: false
	});
};
