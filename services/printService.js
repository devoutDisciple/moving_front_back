const sequelize = require("../dataSource/MysqlPoolClass");
const order = require("../models/order");
const orderModel = order(sequelize);
const shop = require("../models/shop");
const crypto = require("crypto");
const ShopModel = shop(sequelize);
const moment = require("moment");
orderModel.belongsTo(ShopModel, { foreignKey: "shopid", targetKey: "id", as: "shopDetail",});
const AppConfig = require("../config/AppConfig");
const qs = require("querystring");
const http = require("http");
const HOST = "api.feieyun.cn";     //域名
const PATH = "/Api/Open/";         //接口路径
let signature = function(STIME){
	return crypto.createHash("sha1").update(AppConfig.USER + AppConfig.UKEY+ STIME).digest("hex");//获取签名
};
let getLen = function(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		let charCode = str.charCodeAt(i);
		if (charCode >127 || charCode == 94) {
			len += 2;
		} else {
			len ++;
		}
	}
	return len;
};

module.exports = {


	printOrder: async (orderid) => {
		try {
			let order = await orderModel.findOne({
				where: {
					id: orderid
				},
				include: [{
					model: ShopModel,
					as: "shopDetail",
				}],
			});
			if(order.shopDetail.auto_print != 1) return;
			await orderModel.update({print: 2}, {
				where: {
					id: orderid
				}
			});
			let sn = order.shopDetail.sn;
			if(!sn) return "请录入打印机编号";
			console.log(order);
			let orderList = JSON.parse(order.order_list) || [];
			//标签说明：
			//单标签:
			//"<BR>"为换行,"<CUT>"为切刀指令(主动切纸,仅限切刀打印机使用才有效果)
			//"<LOGO>"为打印LOGO指令(前提是预先在机器内置LOGO图片),"<PLUGIN>"为钱箱或者外置音响指令
			//成对标签：
			//"<CB></CB>"为居中放大一倍,"<B></B>"为放大一倍,"<C></C>"为居中,<L></L>字体变高一倍
			//<W></W>字体变宽一倍,"<QR></QR>"为二维码,"<BOLD></BOLD>"为字体加粗,"<RIGHT></RIGHT>"为右对齐
			//拼凑订单内容时可参考如下格式
			//根据打印纸张的宽度，自行调整内容的格式，可参考下面的样例格式

			var orderInfo;
			orderInfo = "<CB>贝沃思美食</CB><BR>"; //标题字体如需居中放大,就需要用标签套上
			orderInfo += "<C>一点点奶茶</C><BR>"; //标题字体如需居中放大,就需要用标签套上
			orderInfo += "名称　　　　　     数量  金额<BR>";
			orderInfo += "-------------------------------<BR>";
			orderList.map(item => {
				let res_len = Number(24 - getLen(item.goodsName));
				orderInfo += `${String(item.goodsName).padEnd(res_len)}${String(item.num).padEnd(6)}${(Number(item.price) * Number(item.num)).toFixed(2)}<BR>`;
				orderInfo += `规格:  ${item.specification}<BR>`;
			});
			orderInfo += `备注：${order.desc}<BR>`;
			orderInfo += "--------------------------------<BR>";
			orderInfo += `合计：${order.total_price} 元<BR>`;
			orderInfo += `送货地点：${order.address}<BR>`;
			orderInfo += `联系电话：${order.phone}<BR>`;
			orderInfo += `订餐时间：${moment(order.order_time).format("YYYY-MM-DD HH:mm:ss")}<BR><BR>`;
			var STIME = Math.floor(new Date().getTime() / 1000); //请求时间,当前时间的秒数
			var post_data = {
				user: AppConfig.USER, //账号
				stime: STIME, //当前时间的秒数，请求时间
				sig: signature(STIME), //签名
				apiname: "Open_printMsg", //不需要修改
				sn: sn, //打印机编号
				content: orderInfo, //打印内容
				times: "1" //打印联数,默认为1
			};
			var content = qs.stringify(post_data);
			var options = {
				hostname: HOST,
				port: 80,
				path: PATH,
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
				}
			};
			var req = http.request(options, function (res) {
				res.setEncoding("utf-8");
				res.on("data", function (response) {
					//response是返回的JSON字符串
					//服务器返回值，建议要当做日志记录起来
					console.log(response);
				});
			});
			req.on("error", function () {
				console.log("error!");
			});
			req.write(content);
			req.end();
		} catch (error) {
			console.log(error);
			return "fail";
		}
	},


};
