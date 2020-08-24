module.exports = {
	countMoney: (item) => {
		if (item.money && item.discount) {
			// 原始价格
			item.money = Number(item.money).toFixed(2);
			// 原始价格
			item.origin_money = Number(item.money).toFixed(2);
			// 折扣后的价格
			item.discountMoney = Number((item.money * item.discount) / 10).toFixed(2);
			// 折扣的减少了多少钱
			item.subDiscountMoney = Number(item.money - item.discountMoney).toFixed(2);
			// 用户应付金额
			item.payMoney = Number(item.discountMoney).toFixed(2);
			// 加急订单
			if (item.urgency === 2) {
				// 加急的费用
				item.urgencyMoney = Number(item.money * 0.5).toFixed(2);
				// 折扣后的价格
				item.discountMoney = Number((item.money * 1.5 * item.discount) / 10).toFixed(2);
				// 折扣的减少了多少钱
				item.subDiscountMoney = Number(item.money * 1.5 - item.discountMoney).toFixed(2);
				// 用户应付金额
				item.payMoney = Number(item.discountMoney).toFixed(2);
			}
			if (item.payMoney * 1 == 0) {
				item.payMoney = 0.01;
			}
			if (item.payMoney < 0) {
				item.payMoney = 100000;
			}
		}
	},
};
