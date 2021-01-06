const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const bill = require('../models/bill');
const responseUtil = require('../util/responseUtil');

const billModel = bill(sequelize);

module.exports = {
	// 根据用户id获取所有消费记录
	getAllBillByUserid: async (req, res) => {
		try {
			const { userid } = req.query;
			const areas = await billModel.findAll({
				where: { userid },
				order: [['create_time', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(areas, [
				'id',
				'userid',
				'orderid',
				'money',
				'send',
				'pay_type',
				'type',
				'create_time',
			]);
			result.forEach(item => {
				item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
