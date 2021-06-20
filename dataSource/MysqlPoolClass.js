const Sequelize = require('sequelize');
const config = require('../config/sqlConfig');

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},

	timezone: '+08:00', // 东八时区

	// SQLite only
	storage: 'path/to/database.sqlite',
	logging: false, // 关闭日志功能

	// http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
	// operatorsAliases: false,
});

module.exports = sequelize;
