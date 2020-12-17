const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const ranking = require('../models/ranking');

const rankingModal = ranking(sequelize);
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 获取排行榜数据  type 1-最近七天 2-最近一个月
	getRankingByType: async (req, res) => {
		try {
			const { type } = req.query;
			// 查看所有排行记录
			const rankings = await rankingModal.findAll({
				where: { type },
				order: [['money', 'DESC']],
				limit: 20,
			});
			const result = responseUtil.renderFieldsAll(rankings, ['id', 'userid', 'username', 'money', 'discount', 'create_time']);
			result.sort((a, b) => Number(b.money) - Number(a.money));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
