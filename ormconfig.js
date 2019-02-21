const config = require('config');

// here we are clonning the config object because it's frozen by config
// and typeorm tries to change it
module.exports = {
  ...config.get('db'),
};
