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
			const shopid = req.query.shopid;
			const cabinets = await CabinetModel.findAll({
				where: { shopid },
				order: [['sort', 'DESC']],
			});
			const reslut = responseUtil.renderFieldsAll(cabinets, ['id', 'shopid', 'name', 'address', 'boxid', 'url']);
			res.send(resultMessage.success(reslut));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 获取柜子详细信息
	getDetailById: async (req, res) => {
		const { cabinetId } = req.query;
		try {
			const data = await CabinetModel.findOne({
				where: { id: cabinetId },
			});
			const result = responseUtil.renderFieldsObj(data, ['id', 'shopid', 'name', 'address', 'boxid', 'url', 'create_time', 'sort']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 获取柜子状态
	getStateById: async (req, res) => {
		const cabinetId = req.query.cabinetId;
		try {
			const data = await CabinetModel.findOne({
				where: { id: cabinetId },
			});
			const used = JSON.parse(data.used);
			const usedState = cabinetUtil.getBoxUsedState(used);
			res.send(resultMessage.success(usedState));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},

	// 打开柜子
	openCellSave: async (req, res) => {
		try {
			const { boxid, type, cabinetId, userid } = req.body;
			// 获取token
			let boxLoginDetail = await cabinetUtil.getToken();
			boxLoginDetail = JSON.parse(boxLoginDetail);
			const token = boxLoginDetail.data || '';
			if (!token) return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			// 打开格子
			const result = await cabinetUtil.openCellSave(cabinetId, boxid, token, type, userid);
			if (!result) {
				return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
			}
			if (result && result.code !== 200) {
				return res.send(resultMessage.error(result.message));
			}
			// 打开的格子id
			const used = result.used;
			const cellid = result.data;
			// 更新可用格子状态
			await CabinetModel.update(
				{ used: JSON.stringify(used) },
				{
					where: { id: cabinetId },
				},
			);
			res.send(resultMessage.success({ cellid }));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
