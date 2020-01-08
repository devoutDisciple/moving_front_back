const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const evaluate = require("../models/evaluate");
const evaluateModel = evaluate(sequelize);

module.exports = {
	// 增加评价
	addEvaluate: async (req, res) => {
		let body = req.body;
		try {
			// 增加评价
			await evaluateModel.create(body);
			// 更改订单状态
			return "success";
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据商品id获取评价
	getEvaluateByGoodsId: async (req, res) => {
		let goods_id = req.query.goods_id;
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				where: {
					goods_id: goods_id
				},
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				],
			});
			// 获取评价平均值
			let sumEvaluate = await evaluateModel.sum("goods_grade", {
				where: {
					goods_id: goods_id
				}
			});
			res.send(resultMessage.success({
				sumEvaluate,
				result: evaluates
			}));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

};
