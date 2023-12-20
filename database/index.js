const mysql = require('mysql');
const util = require('util');
const env = require('../config/env');

const pool = mysql.createPool({
    host: env.databaseHost,
    user: env.databaseUserName,
    password: env.databasePassword,
    database: env.databaseName,
    port: env.databasePort,
    connectionLimit: 10
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) connection.release()
    return
});

// promisify for node async/await.
pool.query = util.promisify(pool.query)

module.exports = pool