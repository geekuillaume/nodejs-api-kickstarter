module.exports = {
  prettyPrintErrors: true,
  email: {
    testServer: true, // don't forget to add this line to your config/local.js file if you want
    // to get the email preview link on ethereal.email logged in your console
    from: 'contact@yourdomain.com',
    smtp: {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        // You should create a new user here https://ethereal.email/create and register it in your config/local.js file
        // to get a nice debug view of the email you're sending without having
        // to really send them

        // user: 'XXXXXXXXXX',
        // pass: 'XXXXXXXXXX',
      },
    },
  },
};
