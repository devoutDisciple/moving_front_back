const Core = require('@alicloud/pop-core');
const moment = require('moment');
const config = require('../config/AppConfig');
const sequelize = require('../dataSource/MysqlPoolClass');
const account = require('../models/account');
const AppConfig = require('../config/AppConfig');

const accountModel = account(sequelize);

const requestOption = {
	method: 'POST',
};

const client = new Core({
	accessKeyId: config.message_accessKeyId,
	accessKeySecret: config.message_accessKeySecret,
	endpoint: config.message_endpoint,
	apiVersion: config.message_apiVersion,
});

module.exports = {
	// 发送验证信息
	postLoginMessage: (phoneNum, code) => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_loginyanzhengma,
			TemplateParam: JSON.stringify({ code }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				result => {
					console.log(JSON.stringify(result));
					resolve({ phoneNum, code });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送下单成功通知给用户
	sendOrderStartToUser: phoneNum => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_orderStartToUser,
			TemplateParam: JSON.stringify({ name: 'MOVING' }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				result => {
					console.log(JSON.stringify(result));
					resolve({ phoneNum });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单通知给商家
	sendOrderStartToShop: (shopPhone, username, userPhone) => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
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
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单通知给商家
	sendOrderStartToShopBatch: (PhoneNumberJson, username, userPhone) => {
		if (AppConfig.send_message_flag === 2) return;
		if (!Array.isArray(PhoneNumberJson)) return;
		const SignNameJson = [];
		const TemplateParamJson = [];
		PhoneNumberJson.forEach(() => {
			SignNameJson.push(config.notify_message_sign);
			TemplateParamJson.push({ name: username, time: moment().format('YYYY-MM-DD HH:mm:ss'), phone: userPhone });
		});
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumberJson: JSON.stringify(PhoneNumberJson),
			SignNameJson: JSON.stringify(SignNameJson),
			TemplateCode: config.message_orderStartToShop,
			TemplateParamJson: JSON.stringify(TemplateParamJson),
		};
		return new Promise((resolve, reject) => {
			client.request('SendBatchSms', params, requestOption).then(
				() => {
					resolve('success');
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单完成通知给用户
	sendOrderSuccessToUser: phoneNum => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
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
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送订单完成通知给商家
	sendOrderSuccessToShop: (phoneNum, code) => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_orderSuccessToShop,
			TemplateParam: JSON.stringify({ code }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送山门取衣预约成功通知给用户
	sendMessageGetClothingSuccessToUser: phoneNum => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
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
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送预约取衣给商家
	sendMessageGetClothingSuccessToShop: (phoneNum, code) => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_getClothingSuccessToShop,
			TemplateParam: JSON.stringify({ code }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 批量发送预约取衣给商家
	sendMessageGetClothingSuccessToShopBatch: (PhoneNumberJson, code) => {
		if (AppConfig.send_message_flag === 2) return;
		if (!Array.isArray(PhoneNumberJson)) return;
		const SignNameJson = [];
		const TemplateParamJson = [];
		PhoneNumberJson.forEach(() => {
			SignNameJson.push(config.notify_message_sign);
			TemplateParamJson.push({ code });
		});
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumberJson: JSON.stringify(PhoneNumberJson),
			SignNameJson: JSON.stringify(SignNameJson),
			TemplateCode: config.message_getClothingSuccessToShop,
			TemplateParamJson: JSON.stringify(TemplateParamJson),
		};
		return new Promise((resolve, reject) => {
			client.request('SendBatchSms', params, requestOption).then(
				() => {
					resolve('success');
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送积分兑换通知给用户
	sendMessageIntergralGoodsSuccessToUser: (phoneNum, name) => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_intergralGoodsSuccessToUser,
			TemplateParam: JSON.stringify({ name }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送积分兑换通知给商家
	sendMessageIntergralGoodsSuccessToShop: phoneNum => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_intergralGoodsSuccessToShop,
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				() => {
					resolve({ phoneNum });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送积分兑换通知给商家
	sendMessageIntergralGoodsSuccessToShopBatch: PhoneNumberJson => {
		if (AppConfig.send_message_flag === 2) return;
		if (!Array.isArray(PhoneNumberJson)) return;
		const SignNameJson = [];
		PhoneNumberJson.forEach(() => {
			SignNameJson.push(config.notify_message_sign);
		});
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumberJson: JSON.stringify(PhoneNumberJson),
			SignNameJson: JSON.stringify(SignNameJson),
			TemplateCode: config.message_intergralGoodsSuccessToShop,
		};
		return new Promise((resolve, reject) => {
			client.request('SendBatchSms', params, requestOption).then(
				() => {
					resolve('success');
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送用户店内下单成功通知给用户
	sendUserShopOrderSuccessToUser: phoneNum => {
		if (AppConfig.send_message_flag === 2) return;
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_userShopOrderSuccessToUsre,
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				result => {
					console.log(JSON.stringify(result));
					resolve({ phoneNum });
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 发送用户店内订单通知给商家
	sendUserShopOrderSuccessToShopBatch: PhoneNumberJson => {
		if (AppConfig.send_message_flag === 2) return;
		if (!Array.isArray(PhoneNumberJson)) return;
		const SignNameJson = [];
		PhoneNumberJson.forEach(() => {
			SignNameJson.push(config.notify_message_sign);
		});
		const params = {
			RegionId: 'cn-hangzhou',
			PhoneNumberJson: JSON.stringify(PhoneNumberJson),
			SignNameJson: JSON.stringify(SignNameJson),
			TemplateCode: config.message_userShopOrderSuccessToShop,
		};
		return new Promise((resolve, reject) => {
			client.request('SendBatchSms', params, requestOption).then(
				() => {
					resolve('success');
				},
				ex => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 随机的验证码
	getMessageCode: () => {
		const numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		let str = '';
		for (let i = 0; i < 6; i++) {
			const random = Math.floor(Math.random() * numArr.length);
			str += numArr[random];
		}
		return str;
	},

	// 获取需要发送给商家的电话列表
	getShopPhoneList: async shopid => {
		const accountLists = await accountModel.findAll({ where: { shopid } });
		const phoneList = [];
		if (Array.isArray(accountLists)) {
			accountLists.forEach(item => {
				if (Number(item.send_message) !== 2) phoneList.push(item.phone);
			});
		}
		return phoneList;
	},
};
