// eslint.config.js
module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:node/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'script' // 'module' if you plan to use import/export in your source files
    },
    rules: {
      'max-len': ['error', { code: 80 }],
      'quotes': ['error', 'double'],
      'indent': ['error', 2],
      'object-curly-spacing': ['error', 'never'],
    }
  };
  