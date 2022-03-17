require('dotenv').config();

module.exports = {
    dbConfig: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
}