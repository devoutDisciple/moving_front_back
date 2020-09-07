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
			let { userid } = req.query;
			if (!userid) return res.send(resultMessage.error('暂无用户信息'));
			let data = await userModel.findOne({
				where: {
					id: userid,
				},
			});
			// eslint-disable-next-line
			let result = responseUtil.renderFieldsObj(data, ['id', 'nickname', 'username', 'address', 'age', 'balance', "email", 'integral', 'phone', 'sex', "photo", 'member', "cabinet_use_time"]);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 根据用户id获取当前用户信息
	getUserCabinetUseTimeByUserid: async (req, res) => {
		try {
			let { userid } = req.query;
			if (!userid) return res.send(resultMessage.error('暂无用户信息'));
			let data = await userModel.findOne({ where: { id: userid } });
			// eslint-disable-next-line
			let result = responseUtil.renderFieldsObj(data, ["cabinet_use_time"]);
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

	// 减少用户使用柜子次数
	subCabinetUseTime: async (req, res) => {
		try {
			let { userid } = req.body;
			let data = await userModel.findOne({
				where: {
					id: userid,
				},
			});
			let cabinet_use_time = data.cabinet_use_time;
			let current_cabinet_use_time = (Number(cabinet_use_time) - 1).toFixed(0);
			if (current_cabinet_use_time < 0) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			await userModel.update({ cabinet_use_time: current_cabinet_use_time }, { where: { id: userid } });
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

	// 更改用户积分
	updateUserIntergral: async (req, res) => {
		try {
			let { userid, money } = req.body;
			let user = await userModel.findOne({ where: { id: userid } });
			let currentIntergral = user.integral;
			let updateIntergral = Number(currentIntergral) + parseInt(Number(money));
			await userModel.update(
				{ integral: updateIntergral },
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
			// 增加余额
			let currentMoney = user.balance;
			let balance = Number(currentMoney) + Number(money) + Number(given);
			// 增加积分
			let currentIntegral = user.integral;
			let integral = Number(currentIntegral) + Number(money) + Number(given);
			await userModel.update(
				{ balance: balance, integral: integral, member: 2 },
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
