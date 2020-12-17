module.exports = {
	getInt: num => Number(num).toFixed(0),
	getFloat: num => Number(num).toFixed(2),
	sumInt: (a, b) => {
		const sum = Number(a) + Number(b);
		return Number(sum).toFixed(0);
	},
	sumFloat: (a, b) => {
		const sum = (Number(a) + Number(b)).toFixed(2);
		return sum;
	},
};
