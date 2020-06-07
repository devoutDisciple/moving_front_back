const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const cabinet = require('../models/cabinet');
const CabinetModel = cabinet(sequelize);
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
	openCellSave: async (req, res) => {
		try {
			let { boxid, type, cabinetId } = req.body;
			// 获取token
			let boxLoginDetail = await cabinetUtil.getToken();
			boxLoginDetail = JSON.parse(boxLoginDetail);
			let token = boxLoginDetail.data || '';
			if (!token) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			// 打开格子
			let result = await cabinetUtil.openCellSave(cabinetId, boxid, token, type);
			if (!result || result.code != 200) {
				return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			}
			// 打开的格子id
			let used = result.used,
				cellid = result.data;
			// 更新可用格子状态
			await CabinetModel.update(
				{ used: JSON.stringify(used) },
				{
					where: {
						id: cabinetId,
					},
				},
			);
			res.send(resultMessage.success({ cellid }));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
