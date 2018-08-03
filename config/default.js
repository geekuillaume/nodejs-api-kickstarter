module.exports = {
  port: 5000,
  consoleLoggerEnabled: true,
  prettyPrintErrors: false,
  loggerLevel: 'info',
  db: {
    // you should probably change this with the database you want to use in production
    // look at ./production.js for more info
    client: 'pg',
    // connection: {
    //   host: '127.0.0.1',
    //   user: 'your_database_user',
    //   password: 'your_database_password',
    //   database: 'myapp_test',
    // },
    // look here for more info: http://knexjs.org/#Installation-client
  },
  hashingRounds: 10,
  // you should change this by a fixed token that you should generate securely
  // By default, the secret will always be changed and so the server will not be stateless
  // But I don't want to provide a fixed secret for people that will forget to change it
  jwtSecret: require('crypto').randomBytes(48).toString('hex'), // eslint-disable-line
  apiAddress: 'https://api.example.com', // replace this with the address where your api is hosted
  activateCallbackUrl: 'https://app.exmaple.com/after_activation', // new users will be redirected to this address after activating their account
  uuidTestNamespace: 'e50b0ca8-d1e4-40cd-f10f-a49e8b7cc4de', // this is used to create deterministic uuid for our tests
};
