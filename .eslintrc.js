module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'consistent-return': 0,
        camelcase: 0,
        'no-param-reassign': 0,
        'linebreak-style': [
            'error',
            'unix',
        ],
        semi: [
            'error',
            'always',
        ],
        indent: ['error', 4],
    },
};
