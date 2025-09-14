module.exports = {
  extends: ['next/core-web-vitals'],
  overrides: [
    {
      files: ['**/strapi.generated.ts'],
      rules: {
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
  ignorePatterns: ['strapi.generated.ts'],
};