module.exports = {
  consoleLoggerEnabled: false,
  prettyPrintErrors: true,
  db: {
    // be careful as the database is wipped clean on each test suite
    // NEVER USE YOU PRODUCTION DATABASE HERE
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'boilerplate',
      database: 'boilerplate_test',
    },
    useNullAsDefault: true,
  },
};
