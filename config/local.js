module.exports = {
  // You can overwrite specific config variables here
  // Because this file is in .gitignore, you will not accidentally commit it
  // It's a good place to store secrets that should not be included in your git history
  email: {
    testServer: true, // don't forget to add this line to your config/local.js file if you want
    // to get the email preview link on ethereal.email logged in your console
    from: 'test@test.com',
    smtp: {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        // You should create a new user here https://ethereal.email/create and register it in your config/local.js file
        // to get a nice debug view of the email you're sending without having
        // to really send them

        user: 'n4eim4fmkeli3s7c@ethereal.email',
        pass: 'yXvUDyz48jkcFM88a1',
      },
    },
  },
};
