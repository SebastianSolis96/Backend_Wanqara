const { Pool } = require('pg');
const { dbConfig } = require('./config');

const db = ( user, password, database ) => {

    const pool = new Pool({
        user: user,
        password: password,
        host: dbConfig.host,
        port: dbConfig.port,
        database: database
    });

    return pool;

}

module.exports = {
    db
};