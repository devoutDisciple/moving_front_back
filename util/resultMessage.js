module.exports = {
	success: (data) => {
		return {
			code: 200,
			success: true,
			data: data,
		};
	},
	// 重新登录的
	toLogin: () => {
		return {
			code: 502,
			success: true,
			data: '请登录',
		};
	},
	// 需要提示错误信息的
	error: (data) => {
		return {
			code: 500,
			success: false,
			message: data,
		};
	},
};
