const config = require('config');
require('reflect-metadata');

// here we are clonning the config object because it's frozen by config
// and typeorm tries to change it
module.exports = {
  ...config.get('db'),
  entities: [
    'dist/src/models/**/*Schema.js',
  ],
  migrations: [
    'dist/migrations/*.js',
  ],
  cli: { migrationsDir: 'migrations' },
  logging: true,
  logger: 'debug',
};
