module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': ['error', 2, { SwitchCase: 1 }], // Use 2 spaces for indentation
    'quotes': ['error', 'single'], // Use single quotes
    'prefer-const': 'error', // Prefer const over let
    'require-await': 'error', // Ensure async functions have await statements
    'no-unused-vars': 'warn', // Generate a warning for unused variable
    // Add more linter rules
  }
}
