const moment = require("moment");
module.exports = {
	copy: (obj) => {
		let newObj = {};
		for(let key in obj) {
			newObj[key] = obj[key];
		}
		return newObj;
	},
	// 生成随机字符串
	getNonceStr: function() {
		let str = "";
		let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		for(let i = 1; i <= 32; i++){
			let random = Math.floor(Math.random()*arr.length);
			str += arr[random];
		}
		return str;
	},
	// 生成token
	getToken: function() {
		let str = "";
		let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		for(let i = 1; i <= 16; i++){
			let random = Math.floor(Math.random()*arr.length);
			str += arr[random];
		}
		str = str + "_" + new Date().getTime();
		return str;
	},
	// 判断两个时间的大小
	maxTime: function(a, b) {
		let timeA = moment(a).valueOf();
		let timeB = moment(b).valueOf();
		return timeA - timeB;
	}
};
