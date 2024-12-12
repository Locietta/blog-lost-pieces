module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  globals: {
    Post: 'readonly',
    LoiaTheme: 'readonly'
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      tsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint'],
  ignorePatterns: ['dist/', 'cache/', 'node_modules/', '*.json', '.temp/', '*.d.ts', '.eslintrc.cjs'],
  rules: {
    'array-bracket-newline': ['error', 'consistent'],
    'vue/multi-word-component-names': 0
  }
}
