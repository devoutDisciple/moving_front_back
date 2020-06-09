const resultMessage = require('../util/resultMessage');
const PrintUtil = require('../util/PrintUtil');

module.exports = {
	// 打印订单
	printOrder: async (req, res) => {
		try {
			await PrintUtil.printOrder(req, res);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
		}
	},
};
