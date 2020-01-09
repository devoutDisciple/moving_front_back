const sequelize = require("../dataSource/MysqlPoolClass");
const resultMessage = require("../util/resultMessage");
const PostMessage = require("../util/PostMessage");
const register = require("../models/register");
const moment = require("moment");
const registerModel = register(sequelize);

module.exports = {
	// 获取广告数据
	register: async (req, res) => {
		try {
			// let data = await registerModel.findAll();
			res.send(resultMessage.success("hello"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 发送验证码
	sendMessage: async (req, res) => {
		try {
			let {phoneNum} = req.body;
			console.log(phoneNum);
			let code = PostMessage.getMessageCode();
			// let result = await PostMessage.postMessage(phone, code);
			let result = { phoneNum: phoneNum, code: code };
			console.log(result, 678);
			let phoneModel = await registerModel.findOne({
				where: {
					phone: phoneNum
				}
			});
			// 如果存在则删除这条记录
			if(phoneModel) {
				await registerModel.destroy({
					where: {
						phone: phoneNum
					}
				});
			}
			// 插入该条数据
			await registerModel.create({
				phone: phoneNum,
				security_code: code,
				create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
				expire_time: moment().add("seconds", 60).format("YYYY-MM-DD HH:mm:ss")
			});
			res.send(resultMessage.success(""));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
