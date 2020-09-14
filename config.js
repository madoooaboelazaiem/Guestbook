require("dotenv").config()

module.exports = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRETKEY: process.env.SECRETKEY,
  EMAIL: process.env.EMAIL,
  PASS: process.env.PASS,
}
