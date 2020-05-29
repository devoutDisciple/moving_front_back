const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const address = require('../models/address');
const responseUtil = require('../util/responseUtil');
const addressModel = address(sequelize);

module.exports = {
	// 根绝用户id获取所有地址
	getAllByUserid: async (req, res) => {
		try {
			let areas = await addressModel.findAll({
				where: {
					userid: req.query.userid,
					is_delete: 1,
				},
				order: [['create_time', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(areas, ['id', 'userid', 'username', 'phone', 'sex', 'area', 'street', 'is_defalut']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 根据用户id查询地址
	getAddressById: async (req, res) => {
		try {
			let areas = await addressModel.findOne({
				where: {
					id: req.query.id,
					is_delete: 1,
				},
				order: [['create_time', 'DESC']],
			});
			let result = responseUtil.renderFieldsObj(areas, ['id', 'userid', 'username', 'phone', 'sex', 'area', 'street', 'is_defalut']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 新增地址
	add: async (req, res) => {
		try {
			let address = req.body;
			address.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
			await addressModel.create(address);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 修改地址
	update: async (req, res) => {
		try {
			let { id, area, username, phone, sex, street, is_defalut } = req.body;
			await addressModel.update(
				{ area, username, phone, sex, street, is_defalut },
				{
					where: { id },
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};