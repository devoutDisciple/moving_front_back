const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const intergralRecord = require('../models/intergral_record');

const intergralRecordModel = intergralRecord(sequelize);
const user = require('../models/user');

const userModel = user(sequelize);

const goods = require('../models/intergral_goods');

const goodsModel = goods(sequelize);
intergralRecordModel.belongsTo(goodsModel, { foreignKey: 'goodsid', targetKey: 'id', as: 'goodsDetail' });

const shop = require('../models/shop');

const shopModel = shop(sequelize);
intergralRecordModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

const responseUtil = require('../util/responseUtil');

module.exports = {
	// 添加兑换记录
	add: async (req, res) => {
		try {
			const body = req.body;
			const params = {
				userid: body.userid,
				shopid: body.shopid,
				goodsId: body.goodsId,
				intergral: body.intergral,
				address: body.address || '{}',
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			const userDetail = await userModel.findOne({ where: { id: body.userid } });
			const goodsDetail = await goodsModel.findOne({ where: { id: body.goodsId } });
			if (!userDetail) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			if (Number(userDetail.integral) < Number(goodsDetail.intergral)) return res.send(resultMessage.error('兑换失败,您的积分不足'));
			await intergralRecordModel.create(params);
			const currentIntergral = Number(userDetail.integral) - Number(goodsDetail.intergral);
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

	getRecordByUserid: async (req, res) => {
		try {
			// 查询是否注册过
			const records = await intergralRecordModel.findAll({
				where: { userid: req.query.userid },
				order: [['create_time', 'DESC']],
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
					{
						model: goodsModel,
						as: 'goodsDetail',
					},
				],
			});
			const result = responseUtil.renderFieldsAll(records, ['id', 'intergral', 'status', 'create_time']);
			result.forEach((item, index) => {
				item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				item.shopName = records[index].shopDetail ? records[index].shopDetail.name || '' : '';
				item.goodsName = records[index].goodsDetail ? records[index].goodsDetail.name || '' : '';
				item.goodsUrl = records[index].goodsDetail ? records[index].goodsDetail.url || '' : '';
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
