const md5 = require('md5');
const moment = require('moment');
const request = require('request');
const config = require('../config/AppConfig');
const sequelize = require('../dataSource/MysqlPoolClass');
const ObjectUtil = require('./ObjectUtil');
const cabinet = require('../models/cabinet');
const CabinetModel = cabinet(sequelize);

module.exports = {
	// 获取token
	getToken: () => {
		return new Promise((resolve, reject) => {
			try {
				request(
					{
						url: config.box_login_url,
						method: 'POST',
						form: { userid: config.box_userid, password: config.box_password },
					},
					function (error, response, body) {
						if (error) return reject(body);
						resolve(body);
					},
				);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	},

	// 查看柜体状态
	getState: async (token, boxid) => {
		return new Promise((resolve, reject) => {
			try {
				let params = {
						mtype: config.box_mtype,
						boxid: boxid,
						mtoken: token,
						time: moment().format('YYYY-MM-DD HH:mm:ss'),
						skey: config.box_skey,
					},
					str = md5(params.boxid + params.time + params.skey).toLowerCase();
				params.sign = str;
				request(
					{
						url: config.box_getState_url,
						method: 'POST',
						headers: params,
						form: { boxid: boxid },
					},
					function (error, response, body) {
						if (error) return reject(body);
						resolve(body);
					},
				);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	},

	// 存放衣物打开柜子
	openCellSave: (cabinetId, boxid, token, type) => {
		return new Promise(async (resolve, reject) => {
			try {
				let data = await CabinetModel.findOne({
					where: {
						id: cabinetId,
					},
				});
				let used = JSON.parse(data.used);
				let allBox = type === 'smallBox' ? config.box_samll_num : config.box_big_num;
				let emptyCell = [];
				allBox.forEach((item) => {
					if (!used.includes(item)) emptyCell.push(item);
				});
				if (emptyCell.length === 0)
					return resolve({
						code: 500,
						success: false,
						data: '暂无格口可用',
						message: '暂无格口可用',
					});
				let cellid = emptyCell[0];
				const params = {
					mtype: config.box_mtype,
					boxid: boxid,
					mtoken: token,
					time: moment().format('YYYY-MM-DD HH:mm:ss'),
					skey: config.box_skey,
					cellid: cellid,
				};
				const str = md5(params.boxid + params.cellid + params.time + params.skey).toLowerCase();
				params.sign = str;
				request(
					{
						url: config.box_open_url,
						method: 'POST',
						headers: params,
						form: { boxid: boxid, cellid: cellid },
					},
					function (error, response, body) {
						let data = '{ "code": 200, "message": "No Box Information" }';
						if (error) return reject(data);
						let result = JSON.parse(data);
						if (result && result.code === 200) {
							used.push(cellid);
							return resolve({ code: 200, success: true, data: cellid, used: used });
						}
						return reject({ code: 400, success: false, message: '打开格子失败，请稍后重试' });
					},
				);
			} catch (error) {
				console.log(error);
				reject({ code: 400, success: false, message: '打开格子失败，请稍后重试' });
			}
		});
	},

	// 取出衣物
	openCellGet: (cabinetId, boxid, cellid, token) => {
		return new Promise(async (resolve, reject) => {
			try {
				let data = await CabinetModel.findOne({
					where: {
						id: cabinetId,
					},
				});
				let used = JSON.parse(data.used);
				const params = {
					mtype: config.box_mtype,
					boxid: boxid,
					mtoken: token,
					time: moment().format('YYYY-MM-DD HH:mm:ss'),
					skey: config.box_skey,
					cellid: cellid,
				};
				const str = md5(params.boxid + params.cellid + params.time + params.skey).toLowerCase();
				params.sign = str;
				request(
					{
						url: config.box_open_url,
						method: 'POST',
						headers: params,
						form: { boxid: boxid, cellid: cellid },
					},
					function (error) {
						let data = '{ "code": 200, "message": "No Box Information" }';
						if (error) return reject(data);
						let result = JSON.parse(data);
						if (result && result.code === 200) {
							used = ObjectUtil.arrRemove(used, cellid);
							return resolve({ code: 200, success: true, data: cellid, used: used });
						}
						return reject({ code: 400, success: false, message: '打开格子失败，请稍后重试' });
					},
				);
			} catch (error) {
				console.log(error);
				reject({ code: 400, success: false, message: '打开格子失败，请稍后重试' });
			}
		});
	},

	// 获取可用格子
	getBoxUsedState: (usedArr) => {
		let { box_big_num, box_samll_num } = config;
		let big_box_used_num = 0,
			small_box_empty_num = 0;
		box_big_num.forEach((item) => {
			if (usedArr.includes(item)) big_box_used_num++;
		});
		box_samll_num.forEach((item) => {
			if (usedArr.includes(item)) small_box_empty_num++;
		});
		return {
			bigBox: {
				used: big_box_used_num,
				empty: box_big_num.length - big_box_used_num,
			},
			samllBox: {
				used: small_box_empty_num,
				empty: box_samll_num.length - small_box_empty_num,
			},
		};
	},
};
