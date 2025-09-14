module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'at-rule-no-vendor-prefix': null,
    'selector-no-vendor-prefix': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: [
    'node_modules/**',
    'build/**',
    'dist/**',
    '.tmp/**',
    '.cache/**',
    'coverage/**',
    'public/build/**',
  ],
};
