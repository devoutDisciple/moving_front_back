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

	// 根据商店id查询数据  getAllByShopid
	getAllByShopid: async (req, res) => {
		try {
			let { shopid } = req.query;
			let areas = await addressModel.findAll({
				where: {
					shopid: shopid,
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

	// 根据地址id查询地址
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

	// 删除地址
	deleteById: async (req, res) => {
		try {
			let { id } = req.body;
			await addressModel.destroy({
				where: {
					id: id,
				},
			});
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

	// 修改默认地址
	changeDefalut: async (req, res) => {
		try {
			let { preId, currentId } = req.body;
			preId && (await addressModel.update({ is_defalut: 1 }, { where: { id: preId } }));
			await addressModel.update({ is_defalut: 2 }, { where: { id: currentId } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 获取用户默认收货地址
	getUserDefaultAddress: async (req, res) => {
		try {
			let { userid } = req.query;
			let address = await addressModel.findOne({
				where: {
					userid: userid,
					is_defalut: 2,
				},
			});
			let result = responseUtil.renderFieldsObj(address, ['id', 'username', 'phone', 'sex', 'area', 'street']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
