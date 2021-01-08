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

// const postMessage = require('./util/PostMessage');
// const sequelize = require('./dataSource/MysqlPoolClass');
// const account = require('./models/account');
// const accountModel = account(sequelize);

// const postHello = async () => {
// 	let accountLists = await accountModel.findAll({ where: { shopid: 26 } });
// 	let phoneList = [];
// 	if (Array.isArray(accountLists)) {
// 		accountLists.forEach((item) => {
// 			phoneList.push(item.phone);
// 		});
// 	}
// 	postMessage.sendOrderStartToShopBatch(['18210619398', '15906672702'], '张振', '15698766789');
// };
// postHello();
const moment = require('moment');

const time = String(new Date().getTime());
// eslint-disable-next-line prettier/prettier
const arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',];
const getRandomStr = num => {
	let str = '';
	for (let i = 1; i <= num; i++) {
		const random = Math.floor(Math.random() * arr.length);
		str += arr[random];
	}
	return str.toUpperCase();
};
const getTimeStamp = (start, end) => {
	return time.slice(start, end);
};

console.log(`${getRandomStr(3)}${getTimeStamp(4, 8)}${getRandomStr(4)}${getTimeStamp(1, 4)}${getRandomStr(5)}${getTimeStamp(8, 12)}`);

console.log(moment('2020-01-15').diff(moment('2020-01-13'), 'days'));
