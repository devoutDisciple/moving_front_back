const moment = require('moment');
//eslint-disable-next-line
const arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',];

module.exports = {
	copy: (obj) => {
		let newObj = {};
		for (let key in obj) {
			newObj[key] = obj[key];
		}
		return newObj;
	},
	getName: function () {
		let str = '';
		for (let i = 1; i <= 12; i++) {
			let random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		return str;
	},
	// 生成随机字符串
	getNonceStr: function () {
		let str = '';
		for (let i = 1; i <= 32; i++) {
			let random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		return str;
	},
	// 生成token
	getToken: function () {
		let str = '';
		for (let i = 1; i <= 16; i++) {
			let random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		str = str + '_' + new Date().getTime();
		return str;
	},
	// 判断两个时间的大小
	maxTime: function (a, b) {
		let timeA = moment(a).valueOf();
		let timeB = moment(b).valueOf();
		return timeA - timeB;
	},
	// 创建orderCode
	createOrderCode: function () {
		let str = '';
		let tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
		for (let i = 1; i <= 10; i++) {
			let random = Math.floor(Math.random() * tempArr.length);
			str += tempArr[random];
		}
		str = new Date().getTime() + str;
		return str.toUpperCase();
	},
	// 删除数组某个元素
	arrRemove: function (arr, element) {
		let index = arr.indexOf(Number(element));
		if (index === -1) return arr;
		arr.splice(index, 1);
		return arr;
	},
};
