const Core = require("@alicloud/pop-core");
const config = require("../config/AppConfig");

var client = new Core({
	accessKeyId: config.message_accessKeyId,
	accessKeySecret: config.message_accessKeySecret,
	endpoint: "https://dysmsapi.aliyuncs.com",
	apiVersion: "2017-05-25"
});

module.exports = {
	postMessage: (phoneNum, code) => {
		var params = {
			"RegionId": "cn-hangzhou",
			"PhoneNumbers": phoneNum,
			"SignName": config.message_sign,
			"TemplateCode": "SMS_182380047",
			"TemplateParam": JSON.stringify({"code": code})
		};
		var requestOption = {
			method: "POST"
		};
		return new Promise((resolve, reject) => {
			client.request("SendSms", params, requestOption).then((result) => {
				console.log(JSON.stringify(result));
				resolve({phoneNum, code});
			}, (ex) => {
				reject("发送失败");
				console.log(ex);
			});
		});

	},
	getMessageCode: () => {
		let numArr = ["0","1","2","3","4","5","6","7","8","9"];
		let str = "";
		for(let i = 0; i < 6; i++){
			let random = Math.floor(Math.random() * numArr.length);
			str += numArr[random];
		}
		return str;
	}
};


