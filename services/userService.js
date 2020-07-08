const fs = require('fs');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const AppConfig = require('../config/AppConfig');
const user = require('../models/user');
const userModel = user(sequelize);
const ObjectUtil = require('../util/ObjectUtil');
const responseUtil = require('../util/responseUtil');
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
			// eslint-disable-next-line
			let result = responseUtil.renderFieldsObj(data, ['id', 'nickname', 'username', 'address', 'age', 'balance', "email", 'integral', 'phone', 'sex', "photo", 'member']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 根据用户id获取当前用户信息
	getUserByUserid: async (req, res) => {
		try {
			let userid = req.query.userid;
			let data = await userModel.findOne({
				where: {
					id: userid,
				},
			});
			// eslint-disable-next-line
			let result = responseUtil.renderFieldsObj(data, ['id', 'nickname', 'username', 'address', 'age', 'balance', "email", 'integral', 'phone', 'sex', "photo", 'member']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 用户头像新增
	addPhoto: async (req, res) => {
		try {
			let { img, userid } = req.body;
			var base64Data = img.replace(/^data:image\/\w+;base64,/, '');
			var dataBuffer = new Buffer(base64Data, 'base64');
			let filename = 'user_' + ObjectUtil.getName() + '_' + Date.now() + '.jpg';
			await fs.writeFileSync(`${filePath}/${filename}`, dataBuffer);
			await userModel.update(
				{ photo: `${userImgUrl + filename}` },
				{
					where: {
						id: userid,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 用户信息修改
	update: async (req, res) => {
		try {
			let { key, value, userid } = req.body,
				params = {};
			params[key] = value;
			await userModel.update(params, {
				where: {
					id: userid,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 成为会员
	beMember: async (req, res) => {
		try {
			let { token, level } = req.body;
			await userModel.update(
				{ member: level },
				{
					where: {
						token: token,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 余额充值
	recharge: async (req, res) => {
		try {
			let { userid, money, given } = req.body;
			let user = await userModel.findOne({ where: { id: userid } });
			let currentMoney = user.blance;
			let blance = Number(currentMoney) + Number(money) + Number(given);
			await userModel.update(
				{ blance: blance },
				{
					where: {
						id: userid,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
