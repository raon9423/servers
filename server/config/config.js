require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DEV_DB_USERNAME,
    "password": process.env.DEV_DB_PASSWORD || null,
    "database": process.env.DEV_DB_DATABASE,
    "port": parseInt(process.env.DEV_DB_PORT, 10),
    "host": process.env.DEV_DB_HOST,
    "dialect": process.env.DEV_DB_DIALECT
  }
}
