const request = require('request');
const sequelize = require('../dataSource/MysqlPoolClass');
const crypto = require('crypto');
const FilterStatus = require('./FilterStatus');
// const md5 = require('md5');
const moment = require('moment');
const AppConfig = require('../config/AppConfig');

const MoneyUtil = require('./MoneyUtil');

const order = require('../models/order');
const orderModel = order(sequelize);

const shop = require('../models/shop');
const shopModel = shop(sequelize);
orderModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

const user = require('../models/user');
const userModel = user(sequelize);
orderModel.belongsTo(userModel, { foreignKey: 'userid', targetKey: 'id', as: 'userDetail' });

const cabinet = require('../models/cabinet');
const cabinetModel = cabinet(sequelize);
orderModel.belongsTo(cabinetModel, { foreignKey: 'cabinetId', targetKey: 'id', as: 'cabinetDetail' });

let signature = function (STIME) {
	return crypto
		.createHash('sha1')
		.update(AppConfig.PRINT_USER + AppConfig.PRINT_UKEY + STIME)
		.digest('hex'); //获取签名
};

module.exports = {
	// 通过柜子下单，打印小票
	printOrderByOrderId: async (orderid) => {
		return new Promise(async (resolve, reject) => {
			try {
				let orderDetail = await orderModel.findOne({
					where: { id: orderid },
					include: [
						{
							model: shopModel,
							as: 'shopDetail',
						},
						{
							model: userModel,
							as: 'userDetail',
						},
					],
				});
				MoneyUtil.countMoney(orderDetail);
				let userDetail = orderDetail.userDetail;
				let shopDetail = orderDetail.shopDetail;
				let orderInfo = '';
				// 洗衣柜下单
				if (orderDetail.order_type === 1) {
					if (!shopDetail.sn || !shopDetail.key) return '暂无打印机编号';
					let goods = orderDetail.goods;
					goods = JSON.parse(goods);
					let cabinetDetail = await cabinetModel.findOne({ where: { id: orderDetail.cabinetId } });
					orderInfo = '<CB>【 MOVING洗衣 】</CB><BR>'; //标题字体如需居中放大,就需要用标签套上
					// orderInfo += '<C>-------------</C><BR>'; //标题字体如需居中放大,就需要用标签套上
					orderInfo += '<BR>';
					orderInfo += `订单类型：洗衣柜下单<BR>`;
					orderInfo += '<BR>';
					orderInfo += '-------------------------------<BR>';
					orderInfo += '<BR>';
					orderInfo += `衣物概况：<BR>`;
					if (goods.length === 0) {
						orderInfo += `该用户暂未添加衣物<BR>`;
					} else {
						goods.forEach((item) => {
							let itemMoney = Number(item.price * item.num).toFixed(2);
							orderInfo += `${item.name} * ${item.num}   ${itemMoney}元<BR>`;
						});
					}
					orderInfo += '<BR>';
					orderInfo += '--------------------------------<BR>';
					orderInfo += '<BR>';
					orderInfo += `订单编号：${orderDetail.code}<BR>`;
					orderInfo += `是否加急：${orderDetail.urgency === 2 ? '普通订单' : '加急订单'}<BR>`;
					orderInfo += `存放地址：${cabinetDetail.address}<BR>`;
					orderInfo += `存放柜子：${cabinetDetail.name} ${orderDetail.cellid}号格口<BR>`;
					orderInfo += `用户名称：${userDetail.username}<BR>`;
					orderInfo += `联系电话：${userDetail.phone}<BR>`;
					orderInfo += `柜子使用费：${Number(orderDetail.pre_pay).toFixed(2)} 元<BR>`;
					orderInfo += `派送费：${Number(orderDetail.send_money).toFixed(2)} 元<BR>`;
					orderInfo += `原价：${orderDetail.money} 元<BR>`;
					if (orderDetail.urgency === 2) {
						orderInfo += `加急费用：${orderDetail.urgencyMoney} 元<BR>`;
					}
					orderInfo += `优惠：${orderDetail.subDiscountMoney} 元<BR>`;
					orderInfo += `应付金额：${orderDetail.payMoney} 元<BR>`;
					orderInfo += `备注：${orderDetail.desc || '无'}<BR>`;
					orderInfo += `状态：${orderDetail.is_sure === 1 ? '待确认洗衣价格' : '已确认洗衣费用'}<BR>`;
					orderInfo += `下单时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}<BR><BR>`;
					orderInfo += '<QR>MOVING</QR>';
				}

				// 上门取衣
				if (orderDetail.order_type === 2) {
					if (!shopDetail.sn || !shopDetail.key) return '暂无打印机编号';
					orderInfo = '<CB>【 MOVING洗衣 】</CB><BR>'; //标题字体如需居中放大,就需要用标签套上
					// orderInfo += '<C>-------------</C><BR>'; //标题字体如需居中放大,就需要用标签套上
					orderInfo += '<BR>';
					orderInfo += `订单类型：预约上门取衣<BR>`;
					orderInfo += `是否加急：${orderDetail.urgency === 2 ? '普通订单' : '加急订单'}<BR>`;
					orderInfo += '<BR>';
					orderInfo += '-------------------------------<BR>';
					orderInfo += `预约信息：<BR>`;
					orderInfo += `用户名称：${orderDetail.home_username}<BR>`;
					orderInfo += `用户地址：${orderDetail.home_address}<BR>`;
					orderInfo += `用户手机号：${orderDetail.home_phone}<BR>`;
					orderInfo += `预约时间：${moment(orderDetail.home_time).format('YYYY-MM-DD HH:mm:ss')}<BR>`;
					orderInfo += `配送费：${orderDetail.send_money || 0} 元<BR>`;
					orderInfo += `备注：${orderDetail.desc || '无'}<BR>`;
					orderInfo += '-------------------------------<BR>';
					orderInfo += `会员信息：<BR>`;
					orderInfo += `会员名称：${userDetail.username}<BR>`;
					orderInfo += `联系电话：${userDetail.phone}<BR>`;
					orderInfo += `会员类型：${FilterStatus.filterMemberStatus(userDetail.member)}<BR>`;
					orderInfo += '<BR>';
					orderInfo += '<QR>MOVING</QR>';
				}

				// 积分兑换
				if (orderDetail.order_type === 3) {
					if (!shopDetail.sn || !shopDetail.key) return '暂无打印机编号';
					let goods = orderDetail.goods;
					goods = JSON.parse(goods);
					orderInfo = '<CB>【 MOVING洗衣 】</CB><BR>'; //标题字体如需居中放大,就需要用标签套上
					// orderInfo += '<C>-------------</C><BR>'; //标题字体如需居中放大,就需要用标签套上
					orderInfo += '<BR>';
					orderInfo += `订单类型：积分兑换物品<BR>`;
					orderInfo += '<BR>';
					orderInfo += '-------------------------------<BR>';
					orderInfo += `订单编号：${orderDetail.code}<BR>`;
					orderInfo += `兑换物品：${goods.name}<BR>`;
					orderInfo += `用户名称：${orderDetail.intergral_username || '无'}<BR>`;
					orderInfo += `联系方式：${orderDetail.intergral_phone || '无'}<BR>`;
					orderInfo += `用户地址：${orderDetail.intergral_address || '无'}<BR>`;
					orderInfo += `消耗积分：${orderDetail.intergral_num || 0} 积分<BR>`;
					orderInfo += `下单时间：${moment(orderDetail.create_time).format('YYYY-MM-DD HH:mm:ss')}<BR>`;
					orderInfo += '-------------------------------<BR>';
					orderInfo += `会员信息：<BR>`;
					orderInfo += `会员名称：${userDetail.username}<BR>`;
					orderInfo += `联系电话：${userDetail.phone}<BR>`;
					orderInfo += `会员类型：${FilterStatus.filterMemberStatus(userDetail.member)}<BR>`;
					orderInfo += '<BR>';
					orderInfo += '<QR>MOVING</QR>';
				}

				// 店员录入订单
				if (orderDetail.order_type === 4) {
					if (!shopDetail.sn || !shopDetail.key) return '暂无打印机编号';
					orderInfo = '<CB>【 MOVING洗衣 】</CB><BR>'; //标题字体如需居中放大,就需要用标签套上
					// orderInfo += '<C>-------------</C><BR>'; //标题字体如需居中放大,就需要用标签套上
					orderInfo += '<BR>';
					orderInfo += `订单类型：手动录入订单<BR>`;
					orderInfo += '<BR>';
					orderInfo += '-------------------------------<BR>';
					orderInfo += `订单编号：${orderDetail.code}<BR>`;
					orderInfo += `是否加急：${orderDetail.urgency === 2 ? '普通订单' : '加急订单'}<BR>`;
					orderInfo += `用户名称：${orderDetail.home_username}<BR>`;
					orderInfo += `联系方式：${orderDetail.home_phone || '无'}<BR>`;
					orderInfo += `用户地址：${orderDetail.home_address || '无'}<BR>`;
					orderInfo += `收款金额：${orderDetail.money || 0} 元<BR>`;
					orderInfo += `下单时间：${moment(orderDetail.create_time).format('YYYY-MM-DD HH:mm:ss')}<BR>`;
					orderInfo += '-------------------------------<BR>';
					orderInfo += '<BR>';
					orderInfo += '<QR>MOVING</QR>';
				}

				// 店内下单
				if (orderDetail.order_type === 5) {
					if (!shopDetail.sn || !shopDetail.key) return '暂无打印机编号';
					let goods = orderDetail.goods;
					goods = JSON.parse(goods);
					orderInfo = '<CB>【 MOVING洗衣 】</CB><BR>'; //标题字体如需居中放大,就需要用标签套上
					// orderInfo += '<C>-------------</C><BR>'; //标题字体如需居中放大,就需要用标签套上
					orderInfo += '<BR>';
					orderInfo += `订单类型：店内下单<BR>`;
					orderInfo += '<BR>';
					orderInfo += '-------------------------------<BR>';
					orderInfo += '<BR>';
					orderInfo += `衣物概况：<BR>`;
					if (goods.length === 0) {
						orderInfo += `该用户暂未添加衣物<BR>`;
					} else {
						goods.forEach((item) => {
							let itemMoney = Number(item.price * item.num).toFixed(2);
							orderInfo += `${item.name} * ${item.num}   ${itemMoney}元<BR>`;
						});
					}
					orderInfo += '<BR>';
					orderInfo += '--------------------------------<BR>';
					orderInfo += '<BR>';
					orderInfo += `订单编号：${orderDetail.code}<BR>`;
					orderInfo += `是否加急：${orderDetail.urgency === 2 ? '普通订单' : '加急订单'}<BR>`;
					orderInfo += `用户名称：${userDetail.username}<BR>`;
					orderInfo += `联系电话：${userDetail.phone}<BR>`;
					orderInfo += `原价：${orderDetail.money} 元<BR>`;
					if (orderDetail.urgency === 2) {
						orderInfo += `加急费用：${orderDetail.urgencyMoney} 元<BR>`;
					}
					orderInfo += `优惠：${orderDetail.subDiscountMoney} 元<BR>`;
					orderInfo += `应付金额：${orderDetail.payMoney} 元<BR>`;
					orderInfo += `备注：${orderDetail.desc || '无'}<BR>`;
					orderInfo += `配送方式：${orderDetail.send_status == 1 ? 'MOVING洗衣柜' : '用户自取'}<BR>`;
					orderInfo += `下单时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}<BR><BR>`;
					orderInfo += '<QR>MOVING</QR>';
				}
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
				const STIME = Math.floor(new Date().getTime() / 1000); //请求时间,当前时间的秒数
				const post_data = {
					user: AppConfig.PRINT_USER, //账号
					stime: STIME, //当前时间的秒数，请求时间
					sig: signature(STIME), //签名
					apiname: 'Open_printMsg', //不需要修改
					sn: shopDetail.sn, //打印机编号
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
