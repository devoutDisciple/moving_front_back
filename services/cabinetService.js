const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const cabinet = require('../models/cabinet');
const CabinetModel = cabinet(sequelize);
const AppConfig = require('../config/AppConfig');
const cabinetUtil = require('../util/cabinetUtil');
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 根据商店获取快递柜
	getAllByShop: async (req, res) => {
		try {
			let shopid = req.query.shopid;
			let cabinets = await CabinetModel.findAll({
				where: {
					shopid: shopid,
				},
				order: [['sort', 'DESC']],
			});
			const reslut = responseUtil.renderFieldsAll(cabinets, ['id', 'shopid', 'name', 'address', 'boxid', 'url']);
			res.send(resultMessage.success(reslut));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 获取柜子状态
	getStateById: async (req, res) => {
		let cabinetId = req.query.cabinetId;
		try {
			let data = await CabinetModel.findOne({
				where: {
					id: cabinetId,
				},
			});
			let used = JSON.parse(data.used);
			let usedState = cabinetUtil.getBoxUsedState(used);
			res.send(resultMessage.success(usedState));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 打开柜子
	open: async (req, res) => {
		try {
			let { boxid, type } = req.body;
			console.log(boxid);
			let celltype = '小格';
			switch (type) {
				case 'middleBox':
					celltype = '中格';
					break;
				case 'bigBox':
					celltype = '大格';
					break;
				default:
					break;
			}
			// 获取token
			let boxLoginDetail = await cabinetUtil.getToken();
			boxLoginDetail = JSON.parse(boxLoginDetail);
			let token = boxLoginDetail.data || '';
			if (!token) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			// 查看柜体状态
			let boxDetail = await cabinetUtil.getState(token, boxid);
			boxDetail = JSON.parse(boxDetail);
			let data = boxDetail.data || [];
			let cellid = '';
			data.forEach((item) => {
				if (item.celltype === celltype && item.status === '空闲') cellid = item.cellid;
			});
			if (!cellid) return res.send(resultMessage.error('暂无可用格口'));
			let result = await cabinetUtil.openBox(boxid, cellid, token);
			result = JSON.parse(result);
			if (result.code == 200 && result.message == 'success') {
				return res.send(resultMessage.success({ boxid, cellid }));
			}
			res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
