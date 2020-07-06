const Core = require('@alicloud/pop-core');
const config = require('../config/AppConfig');
const moment = require('moment');
const requestOption = {
	method: 'POST',
};

var client = new Core({
	accessKeyId: config.message_accessKeyId,
	accessKeySecret: config.message_accessKeySecret,
	endpoint: config.message_endpoint,
	apiVersion: config.message_apiVersion,
});

module.exports = {
	// 发送验证信息
	postLoginMessage: (phoneNum, code) => {
		var params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.login_message_sign,
			TemplateCode: config.message_loginyanzhengma,
			TemplateParam: JSON.stringify({ code: code }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				(result) => {
					console.log(JSON.stringify(result));
					resolve({ phoneNum, code });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送下单成功通知给用户
	sendOrderStartToUser: (phoneNum) => {
		var params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_orderStartToUser,
			TemplateParam: JSON.stringify({ name: 'MOVING' }), //模板变量值 {"code":"1111"} 对应的模板的${code}
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				(result) => {
					console.log(JSON.stringify(result));
					resolve({ phoneNum });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单通知给商家
	sendOrderStartToShop: (shopPhone, username, userPhone) => {
		var params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: shopPhone,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_orderStartToShop,
			TemplateParam: JSON.stringify({ name: username, time: moment().format('YYYY-MM-DD HH:mm:ss'), phone: userPhone }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ shopPhone });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单完成通知给用户
	sendOrderSuccessToUser: (phoneNum) => {
		var params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_orderSuccessToUser,
			TemplateParam: JSON.stringify({ name: 'MOVING' }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单完成通知给商家
	sendOrderSuccessToShop: (phoneNum, code) => {
		var params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_orderSuccessToShop,
			TemplateParam: JSON.stringify({ code: code }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送山门取衣预约成功通知给用户 message_getClothingSuccessToUser
	sendMessageGetClothingSuccessToUser: (phoneNum) => {
		var params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_getClothingSuccessToUser,
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 随机的验证码
	getMessageCode: () => {
		//eslint-disable-next-line
		let numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		let str = '';
		for (let i = 0; i < 6; i++) {
			let random = Math.floor(Math.random() * numArr.length);
			str += numArr[random];
		}
		return str;
	},
};
