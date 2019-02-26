module.exports = {
  log: {
    level: 'fatal',
  },
  prettyPrintErrors: true,
  db: {
    // be careful as the database is wipped clean on each test suite
    // NEVER USE YOU PRODUCTION DATABASE HERE
    host: '127.0.0.1',
    database: 'kickstarter_test',
    username: 'postgres',
  },
  testMode: true,
};
