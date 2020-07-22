const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const PostMessage = require('../util/PostMessage');

const register = require('../models/register');
const registerModel = register(sequelize);

const user = require('../models/user');
const userModel = user(sequelize);
const responseUtil = require('../util/responseUtil');

const ObjectUtil = require('../util/ObjectUtil');

module.exports = {
	// 发送注册验证码
	sendMessage: async (req, res) => {
		try {
			let { phoneNum } = req.body;
			// 查询是否注册过
			let userRes = await userModel.findOne({
				where: {
					phone: phoneNum,
				},
			});
			// 判断是否注册过
			if (userRes) return res.send(resultMessage.error('该手机号或昵称已注册'));
			let code = PostMessage.getMessageCode();
			// 发送验证码
			await PostMessage.postLoginMessage(phoneNum, code);
			let phoneModel = await registerModel.findOne({
				where: {
					phone: phoneNum,
				},
			});
			// 如果存在则删除这条记录
			if (phoneModel) {
				await registerModel.destroy({
					where: {
						phone: phoneNum,
					},
				});
			}
			// 插入该条数据
			await registerModel.create({
				phone: phoneNum,
				security_code: code,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				expire_time: moment().add('seconds', 60).format('YYYY-MM-DD HH:mm:ss'),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 注册用户
	register: async (req, res) => {
		try {
			let { phone, security_code, password, username } = req.body;
			// 查询是否获得了验证码
			let registerRes = await registerModel.findOne({
				where: {
					phone: phone,
				},
			});
			// 查询是否注册过
			let userRes = await userModel.findOne({
				where: {
					phone: phone,
				},
			});
			// 判断是否注册过
			if (userRes) return res.send(resultMessage.error('该手机号或昵称已注册'));
			// 判断用户的验证码是否正确
			if (!registerRes || registerRes.security_code != security_code) {
				return res.send(resultMessage.error('请输入正确的验证码'));
			}
			// 判断验证码是否过期
			if (moment(registerRes.expire_time).diff(moment(registerRes.create_time), 'seconds') > 60) {
				return res.send(resultMessage.error('该验证码已经过期'));
			}
			// 删除该条暂存的注册记录
			await registerModel.destroy({
				where: {
					phone: phone,
				},
			});
			// 生成token
			let token = ObjectUtil.getToken();
			let userResCreate = await userModel.create({
				username,
				password,
				phone,
				token,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			let result = responseUtil.renderFieldsObj(userResCreate, [
				'id',
				'nickname',
				'username',
				'address',
				'age',
				'balance',
				'email',
				'integral',
				'phone',
				'sex',
				'photo',
				'member',
			]);
			result.token = token;
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
