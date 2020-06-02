const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const intergralRecord = require('../models/intergral_record');
const intergralRecordModel = intergralRecord(sequelize);
const user = require('../models/user');
const userModel = user(sequelize);
const goods = require('../models/intergral_goods');
const goodsModel = goods(sequelize);
const moment = require('moment');

module.exports = {
	// 添加兑换记录
	add: async (req, res) => {
		try {
			let body = req.body;
			let params = {
				userid: body.userid,
				shopid: body.shopid,
				goodsId: body.goodsId,
				intergral: body.intergral,
				address: body.address || '{}',
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			let user = await userModel.findOne({ where: { id: body.userid } });
			let goodsDetail = await goodsModel.findOne({ where: { id: body.goodsId } });
			if (!user) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			if (Number(user.integral) < Number(goodsDetail.intergral)) return res.send(resultMessage.error('兑换失败,您的积分不足'));
			await intergralRecordModel.create(params);
			let currentIntergral = Number(user.integral) - Number(goodsDetail.intergral);
			console.log(currentIntergral, 999);
			await userModel.update(
				{ integral: currentIntergral },
				{
					where: { id: body.userid },
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
