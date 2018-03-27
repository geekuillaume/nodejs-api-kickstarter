module.exports = {
  consoleLoggerEnabled: false,
  prettyPrintErrors: true,
  db: {
    // be careful as the database is wipped clean on each test suite
    // NEVER USE YOU PRODUCTION DATABASE HERE
    client: 'sqlite3',
    connection: {
      filename: ':memory:', // in memory database, not persistant
    },
    useNullAsDefault: true,
  },
};
