const request = require('request');
const crypto = require('crypto');
// const md5 = require('md5');
const moment = require('moment');
const AppConfig = require('../config/AppConfig');

let signature = function (STIME) {
	return crypto
		.createHash('sha1')
		.update(AppConfig.PRINT_USER + AppConfig.PRINT_UKEY + STIME)
		.digest('hex'); //获取签名
};

module.exports = {
	// 通过柜子下单，打印小票
	printOrderByCabinet: async (sn, goods, money, code, username, phone, address, cellid, desc) => {
		return new Promise(async (resolve, reject) => {
			try {
				// 打印机编号
				// sn = '920535072';
				//标签说明：
				//单标签:
				//"<BR>"为换行,"<CUT>"为切刀指令(主动切纸,仅限切刀打印机使用才有效果)
				//"<LOGO>"为打印LOGO指令(前提是预先在机器内置LOGO图片),"<PLUGIN>"为钱箱或者外置音响指令
				//成对标签：
				//"<CB></CB>"为居中放大一倍,"<B></B>"为放大一倍,"<C></C>"为居中,<L></L>字体变高一倍
				//<W></W>字体变宽一倍,"<QR></QR>"为二维码,"<BOLD></BOLD>"为字体加粗,"<RIGHT></RIGHT>"为右对齐
				//拼凑订单内容时可参考如下格式
				//根据打印纸张的宽度，自行调整内容的格式，可参考下面的样例格式
				goods = JSON.parse(goods);
				let orderInfo;
				orderInfo = '<CB>【 MOVING洗衣 】</CB><BR>'; //标题字体如需居中放大,就需要用标签套上
				// orderInfo += '<C>-------------</C><BR>'; //标题字体如需居中放大,就需要用标签套上
				// eslint-disable-next-line no-irregular-whitespace
				// orderInfo += '名称　　　　　       数量  金额<BR>';
				orderInfo += '<BR>';
				orderInfo += '-------------------------------<BR>';
				orderInfo += '<BR>';
				orderInfo += `衣物概况：<BR>`;
				if (goods.length === 0) {
					orderInfo += `该用户暂未添加衣物<BR>`;
				} else {
					goods.forEach((item) => {
						orderInfo += `${item.name} * ${item.num}   ${item.price}元<BR>`;
					});
				}
				orderInfo += '<BR>';
				orderInfo += '--------------------------------<BR>';
				orderInfo += '<BR>';
				orderInfo += `合计：${money} 元<BR>`;
				orderInfo += `订单编号：${code}<BR>`;
				orderInfo += `存放地址：${address} ${cellid}格口<BR>`;
				orderInfo += `用户名称：${username}<BR>`;
				orderInfo += `联系电话：${phone}<BR>`;
				orderInfo += `备注：${desc || '无'}<BR>`;
				orderInfo += `下单时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}<BR><BR>`;
				const STIME = Math.floor(new Date().getTime() / 1000); //请求时间,当前时间的秒数
				const post_data = {
					user: AppConfig.PRINT_USER, //账号
					stime: STIME, //当前时间的秒数，请求时间
					sig: signature(STIME), //签名
					apiname: 'Open_printMsg', //不需要修改
					sn: sn, //打印机编号
					content: orderInfo, //打印内容
					times: '1', //打印联数,默认为1
				};

				request(
					{
						url: 'http://api.feieyun.cn/Api/Open/',
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						form: post_data,
					},
					function (error, response, body) {
						console.log(body, 111);
						if (!error) resolve('sccuss');
					},
				);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	},
};
