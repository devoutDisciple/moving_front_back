module.exports = {
	success: (data) => {
		return {
			code: 200,
			success: true,
			data: data
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
