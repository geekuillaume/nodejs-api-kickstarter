module.exports = {
  port: 5000,
  consoleLoggerEnabled: true,
  prettyPrintErrors: false,
  db: {
    // you should probably change this with the database you want to use in production
    // look at ./production.js for more info
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite',
    },
  },
};
