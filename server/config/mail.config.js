require('dotenv').config(); 

module.exports = {
  MAIL_MAILER: process.env.MAIL_MAILER,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_ENCRYPTION: process.env.MAIL_ENCRYPTION,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
};
