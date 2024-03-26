// {
//     "rules": {
//         "no-unused-vars": 1
//     },
//     "parserOptions": {
//         "ecmaVersion": 2020,
//         "sourceType": "module"
//     }
// }
module.exports = {
    rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
};
