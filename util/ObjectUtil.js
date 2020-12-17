const moment = require('moment');
// eslint-disable-next-line
const arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',];

module.exports = {
	copy: obj => {
		const newObj = {};
		Object.keys(obj).forEach(key => {
			newObj[key] = obj[key];
		});
		return newObj;
	},
	getName() {
		let str = '';
		for (let i = 1; i <= 12; i++) {
			const random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		return str;
	},
	// 生成随机字符串
	getNonceStr() {
		let str = '';
		for (let i = 1; i <= 32; i++) {
			const random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		return str;
	},
	// 生成token
	getToken() {
		let str = '';
		for (let i = 1; i <= 16; i++) {
			const random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		str = `${str}_${new Date().getTime()}`;
		return str;
	},
	// 判断两个时间的大小
	maxTime(a, b) {
		const timeA = moment(a).valueOf();
		const timeB = moment(b).valueOf();
		return timeA - timeB;
	},
	// 创建orderCode
	createOrderCode() {
		let str = '';
		const tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
		for (let i = 1; i <= 6; i++) {
			const random = Math.floor(Math.random() * tempArr.length);
			str += tempArr[random];
		}
		str = new Date().getTime() + str;
		return str.toUpperCase();
	},
	// 删除数组某个元素
	arrRemove(ary, element) {
		const index = ary.indexOf(Number(element));
		if (index === -1) return ary;
		ary.splice(index, 1);
		return ary;
	},
};
