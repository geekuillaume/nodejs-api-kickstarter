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
  hashingRounds: 10,
  // you should change this by a fixed token that you should generate securely
  // By default, the secret will always be changed and so the server will not be stateless
  // But I don't want to provide a fixed secret for people that will forget to change it
  jwtSecret: require('crypto').randomBytes(48).toString('hex'), // eslint-disable-line
  apiAddress: 'https://api.example.com', // replace this with the address where your api is hosted
  activateCallbackUrl: 'https://app.exmaple.com/after_activation', // new users will be redirected to this address after activating their account
};
