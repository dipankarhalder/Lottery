const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ quiet: true });
const databaseConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGOURI);
    console.log(`Database successfully connected on port : 27017.`);
    return connect;
  } catch (err) {
    console.log(`Database failed to connect. ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  PORT: process.env.PORT,
  PLATFORM: process.env.PLATFORM,
  JWTSECRET: process.env.JWTSECRET,
  EXPTIME: process.env.EXPTIME,
  NODEENV: process.env.NODEENV,
  CLIENTURL: process.env.CLIENTURL,
  dbConfig: databaseConnect,
};
