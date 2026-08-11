import base from '../../eslint.config.mjs';

/** API-specific overrides on top of the shared root config. */
export default [
  ...base,
  {
    files: ['src/**/*.ts'],
    rules: {
      // The API is a server process; structured startup/shutdown logging is expected.
      'no-console': 'off',
    },
  },
];
