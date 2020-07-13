const resultMessage = require('../util/resultMessage');
const PrintUtil = require('../util/PrintUtil');
const fs = require('fs');
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default;
const path = require('path');

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

	alipay: async (req, res) => {
		try {
			const alipaySdk = new AlipaySdk({
				// 参考下方 SDK 配置
				appId: '2021001169609094',
				privateKey: fs.readFileSync(path.join(__dirname, '../sshKey/movingcleaner.top_私钥.txt'), 'ascii'),
				alipayRootCertContent: fs.readFileSync(path.join(__dirname, '../sshKey/alipayRootCert.crt'), 'ascii'),
				appCertContent: fs.readFileSync(path.join(__dirname, '../sshKey/appCertPublicKey_2021001169609094.crt'), 'ascii'),
				alipayPublicCertContent: fs.readFileSync(path.join(__dirname, '../sshKey/alipayCertPublicKey_RSA2.crt'), 'ascii'),
				// alipayPublicKey: fs.readFileSync(path.join(__dirname, '../sshKey/应用公钥2048.txt'), 'ascii'),
				charset: 'utf-8', // 字符集编码
				version: '1.0', // 版本，默认 1.0
				signType: 'RSA2', // 秘钥的解码版本
			});
			const formData = new AlipayFormData();
			formData.setMethod('get');
			formData.addField('notifyUrl', 'http://www.com/notify');
			formData.addField('bizContent', {
				outTradeNo: 'out_trade_no',
				productCode: 'QUICK_MSECURITY_PAY',
				totalAmount: '1.00',
				subject: '123',
				body: '432', // 超时时间
			});
			const result = await alipaySdk.exec('alipay.trade.app.pay', {}, { formData: formData });
			let resData = result.split('https://openapi.alipay.com/gateway.do?')[1];
			res.send(resultMessage.success(resData));
		} catch (error) {
			console.log(error);
		}
	},
	test: async (req, res) => {
		res.setHeader('Content-Type', 'text/html');
		let returnData = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
		return res.send(returnData);
	},
};
