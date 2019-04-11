module.exports = {
  jwtSecret: 'test',
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

        user: 'heaven76@ethereal.email',
        pass: 'n4juWaSgqtJvv5B9aW',
      },
    },
  },
};


// Local circleci token: bb6508bea3eba27f4c74e7a27aebc62bf30f59ab
