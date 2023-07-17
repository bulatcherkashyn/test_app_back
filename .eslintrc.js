const OFF = 0,
  WARN = 1,
  ERROR = 2

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'sort-class-members', 'prettier', 'simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'build/**/*.js'],
  rules: {
    'no-useless-constructor': OFF,
    'prettier/prettier': ERROR,
    eqeqeq: ERROR,
    'unused-imports/no-unused-imports': ERROR,
    '@typescript-eslint/interface-name-prefix': OFF,
    "@typescript-eslint/no-non-null-assertion": OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-namespace': OFF,
    '@typescript-eslint/member-delimiter-style': [
      WARN,
      {
        multiline: { delimiter: 'semi' },
        singleline: { delimiter: 'semi' },
      },
    ],
    'quotes': [ERROR, 'single'],
    'padding-line-between-statements': [
      "error",
      { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
      { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]}
    ],
    'no-console': ERROR,
    'no-unused-vars': WARN,
    'no-trailing-spaces': ERROR,
    'simple-import-sort/imports': ERROR,
    'simple-import-sort/exports': ERROR,

    
    // "@typescript-eslint/no-explicit-any": [ERROR, {
    //   ignoreRestArgs: true
    // }],
    "@typescript-eslint/array-type": [ERROR, {
      default: "generic"
    }],
    "@typescript-eslint/explicit-function-return-type": ERROR,
    "no-duplicate-imports": ERROR,
    "indent": 'off',

    "prefer-const": ERROR,
    "no-var": ERROR,
    "sort-class-members/sort-class-members": [
      ERROR, {
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[public-methods]',
          '[arrow-function-properties]',
          '[conventional-private-methods]',
        ],
        accessorPairPositioning: 'getThenSet',
      }
    ]
  },
};
