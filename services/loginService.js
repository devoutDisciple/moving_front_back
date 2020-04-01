const moment = require('moment');
const PostMessage = require('../util/PostMessage');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const userModel = user(sequelize);

const ObjectUtil = require('../util/ObjectUtil');

module.exports = {
	// 通过账号密码登录
	byPassword: async (req, res) => {
		try {
			let { phone, password } = req.body;
			// 查询是否注册过
			let userRes = await userModel.findOne({
				where: {
					phone: phone,
				},
			});
			// 判断是否注册过
			if (!userRes) return res.send(resultMessage.error('该手机号未注册'));
			if (password != userRes.password) return res.send(resultMessage.error('账号或密码错误'));
			// 生成token
			let token = ObjectUtil.getToken();
			await userModel.update(
				{ token },
				{
					where: {
						phone: phone,
					},
				},
			);
			userRes.token = token;
			res.send(resultMessage.success(userRes));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 通过验证码登录
	bySercurityCode: async (req, res) => {
		try {
			let { phone, security_code } = req.body;
			// 查询是否注册过
			let userRes = await userModel.findOne({
				where: {
					phone: phone,
				},
			});
			// 判断是否注册过
			if (!userRes) return res.send(resultMessage.error('该手机号未注册'));
			// 判断验证码是否正确
			if (userRes.security_code != security_code) return res.send(resultMessage.error('验证码错误'));
			// 判断验证码是否过期
			if (ObjectUtil.maxTime(new Date().getTime(), userRes.security_expire_time) > 0) {
				return res.send(resultMessage.error('验证码已经过期'));
			}
			// 生成token
			let token = ObjectUtil.getToken();
			await userModel.update(
				{ token },
				{
					where: {
						phone: phone,
					},
				},
			);
			res.send(resultMessage.success(token));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 重置密码
	resetPassword: async (req, res) => {
		try {
			let { phone, security_code, password, confirmPassword } = req.body;
			// 查询是否注册过
			let userRes = await userModel.findOne({
				where: {
					phone: phone,
				},
			});
			// 判断是否注册过
			if (!userRes) return res.send(resultMessage.error('该手机号未注册'));
			// 判断验证码是否正确
			if (userRes.security_code != security_code) return res.send(resultMessage.error('验证码错误'));
			// 判断验证码是否过期
			if (ObjectUtil.maxTime(new Date().getTime(), userRes.security_expire_time) > 0) {
				return res.send(resultMessage.error('验证码已经过期'));
			}
			// 判断两个密码是否一样
			if (password !== confirmPassword) {
				return res.send(resultMessage.error('两次输入密码不一致'));
			}
			// 生成token
			let token = ObjectUtil.getToken();
			await userModel.update(
				{ password, token },
				{
					where: {
						phone: phone,
					},
				},
			);
			res.send(resultMessage.success(token));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 发送登录验证码
	sendMessage: async (req, res) => {
		try {
			let { phoneNum } = req.body;
			let code = PostMessage.getMessageCode();
			// 发送验证码
			await PostMessage.postMessage(phoneNum, code);
			let userRes = await userModel.findOne({
				where: {
					phone: phoneNum,
				},
			});
			// 如果不存在
			if (!userRes) {
				return res.send(resultMessage.error('该手机号未注册，请先注册'));
			}
			// 更新该条数据
			await userModel.update(
				{
					security_code: code,
					security_create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
					security_expire_time: moment().add('seconds', 60).format('YYYY-MM-DD HH:mm:ss'),
				},
				{
					where: {
						phone: phoneNum,
					},
				},
			);
			res.send(resultMessage.success(''));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
