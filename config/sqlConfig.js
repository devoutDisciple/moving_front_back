const Env = require('./Env');

module.exports = {
	host: Env.env ? '47.107.43.166' : '127.0.0.1',
	password: Env.env ? 'Zz94102500..' : 'admin',

	username: 'root',
	database: 'laundry',
	dialect: 'mysql',
};
