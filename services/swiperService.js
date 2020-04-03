const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const swiper = require('../models/swiper');
const swiperModel = swiper(sequelize);

module.exports = {
	// 获取所有的轮播图
	getAllById: async (req, res) => {
		try {
			let id = req.query.shopid;
			// 查询是否注册过
			let swipers = await swiperModel.findAll({
				where: {
					shop_id: id,
				},
				order: [['sort', 'DESC']],
			});
			res.send(resultMessage.success(swipers));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
