const config = require('config');
require('reflect-metadata');

const shouldUseTranspiledDefinitions = process.env.NODE_ENV === 'production' || process.env.FORCE_JS;

// here we are clonning the config object because it's frozen by config
// and typeorm tries to change it
module.exports = {
  ...config.get('db'),
  entities: [
    shouldUseTranspiledDefinitions ? 'dist/models/**/*Schema.js' : 'src/models/**/*Schema.ts',
  ],
  migrations: [
    shouldUseTranspiledDefinitions ? 'dist/migrations/*.js' : 'migrations/*.ts',
  ],
  cli: { migrationsDir: 'migrations' },
  logging: true,
  logger: 'debug',
};
