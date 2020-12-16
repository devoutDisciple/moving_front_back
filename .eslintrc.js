module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		'consistent-return': 0,
		'no-param-reassign': 0,
		camelcase: 0,
		'prefer-destructuring': 0,
	},
};
