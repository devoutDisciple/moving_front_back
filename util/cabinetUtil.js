const md5 = require('md5');
const moment = require('moment');
const request = require('request');
const config = require('../config/AppConfig');

module.exports = {
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

	openBox: (boxid, cellid, token) => {
		return new Promise((resolve, reject) => {
			try {
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
