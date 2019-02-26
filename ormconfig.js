const config = require('config');

// here we are clonning the config object because it's frozen by config
// and typeorm tries to change it
module.exports = {
  ...config.get('db'),
  entities: [
    process.env.NODE_ENV === 'production' ? 'dist/models/**/*Schema.js' : 'src/models/**/*Schema.ts',
  ],
  migrations: [
    process.env.NODE_ENV === 'production' ? 'dist/migrations/*.js' : 'migrations/*.ts',
  ],
  cli: { migrationsDir: 'migrations' },
  logging: true,
  logger: 'debug',
};
