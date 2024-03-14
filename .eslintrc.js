module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    // 'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    // 'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: "./tsconfig.json"
  },
  rules: {
    "semi": ["error", "never"],
    "max-len": ["error", { "code": 120 }],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "linebreak-style": 0,
    "import/prefer-default-export": 0,
    "import/no-unresolved": "off",
    "import/extensions": [1, "never"],
    "comma-dangle": ["error", "never"],
    "no-param-reassign": 0,
    "object-curly-newline": 0,
    "no-unused-expressions": ["error", { "allowTernary": true }],
    "no-use-before-define": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "dot-notation": ["error", { "allowPattern": "^[A-Z]+(_[A-Z]+)+$" }],
    "class-methods-use-this": 0,
    "guard-for-in": 0,
    "no-restricted-syntax": 0,
    "no-await-in-loop": 0,
    "no-console": ["error", { allow: ["info", "error", "warn"] }],
    "no-promise-executor-return": 0,
    "import/no-extraneous-dependencies": 0
  }
};
