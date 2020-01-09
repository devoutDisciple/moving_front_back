module.exports = {
	success: (data) => {
		return {
			code: 200,
			success: true,
			data: data
		};
	},
	toLogin: () => {
		return {
			code: 502,
			success: true,
			data: "请登录"
		};
	},
	error: (err) => {
		return {
			code: 500,
			success: false,
			message: err.message
		};
	}
};
