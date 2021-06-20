module.exports = {
	success: data => {
		const resData = {
			code: 200,
			success: true,
			data,
		};
		console.info(`请求成功   data: ${JSON.stringify(resData)}`);
		return resData;
	},
	toLogin: () => {
		return {
			code: 502,
			success: true,
			data: '请登录',
		};
	},
	error: data => {
		const resData = {
			code: 500,
			success: false,
			message: data,
		};
		console.info(`请求错误：data: ${JSON.stringify(resData)}`);
		return resData;
	},
};
