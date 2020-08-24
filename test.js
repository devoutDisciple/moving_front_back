// const printUtil = require('./util/PrintUtil');

// // 洗衣柜下单
// printUtil.printOrderByOrderId(234);

// // 上门取衣订单
// printUtil.printOrderByOrderId(250);

// // 积分兑换定案
// printUtil.printOrderByOrderId(242);

// 手动录入订单
// printUtil.printOrderByOrderId(257);

// 测试录入订单
// printUtil.testOrder();

const postMessage = require('./util/PostMessage');
const sequelize = require('./dataSource/MysqlPoolClass');
const account = require('./models/account');
const accountModel = account(sequelize);

const postHello = async () => {
	let accountLists = await accountModel.findAll({ where: { shopid: 26 } });
	let phoneList = [];
	if (Array.isArray(accountLists)) {
		accountLists.forEach((item) => {
			phoneList.push(item.phone);
		});
	}
	postMessage.sendOrderStartToShopBatch(['18210619398', '15906672702'], '张振', '15698766789');
};
postHello();
