const config = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,

  SECRET: process.env.SECRET,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,

  C_CLOUD_NAME: process.env.C_CLOUD_NAME,
  C_API_KEY: process.env.C_API_KEY,
  C_API_SECRET: process.env.C_API_SECRET,
};
config.URL = `mongodb+srv://${config.USER}:${config.PASSWORD}@${config.HOST}/${config.DB}?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = config;
