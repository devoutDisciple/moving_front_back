module.exports = {
	// 返回 [{}, {}]
	renderFieldsAll: (data, fieldsArr = []) => {
		let result = [];
		data.forEach((item) => {
			let obj = {};
			fieldsArr.forEach((key) => {
				obj[key] = item[key];
			});
			result.push(obj);
		});
		return result;
	},

	// 返回 {}
	renderFieldsObj: (data, fieldsArr = []) => {
		let result = {};
		fieldsArr.forEach((key) => {
			result[key] = data[key];
		});
		return result;
	},
};
