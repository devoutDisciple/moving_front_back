const fs = require('fs');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const AppConfig = require('../config/AppConfig');
const user = require('../models/user');
const userModel = user(sequelize);
const ObjectUtil = require('../util/ObjectUtil');
let filePath = AppConfig.userImgFilePath;
let userImgUrl = AppConfig.userImgUrl;

module.exports = {
	// 根据token获取当前用户信息
	getUserByToken: async (req, res) => {
		try {
			let token = req.query.token;
			let data = await userModel.findOne({
				where: {
					token: token,
				},
			});
			res.send(resultMessage.success(data));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 用户头像新增
	addPhoto: async (req, res) => {
		try {
			let { img, token } = req.body;
			var base64Data = img.replace(/^data:image\/\w+;base64,/, '');
			var dataBuffer = new Buffer(base64Data, 'base64');
			let filename = 'user_' + ObjectUtil.getName() + '_' + Date.now() + '.jpg';
			await fs.writeFileSync(`${filePath}/${filename}`, dataBuffer);
			await userModel.update(
				{ photo: `${userImgUrl}/${filename}` },
				{
					where: {
						token: token,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 用户信息修改
	update: async (req, res) => {
		try {
			let { key, value, token } = req.body,
				params = {};
			params[key] = value;
			await userModel.update(params, {
				where: {
					token: token,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
