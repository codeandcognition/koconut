// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

  endpoint: process.env.DB_BKT_ENDPOINT,

//   port: process.env.PORT
};

