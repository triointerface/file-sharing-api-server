import { databaseHost, databasePassword, databaseUserName, databasePort, databaseName } from './config/env.js';
import path from 'path';
const __dirname = path.resolve();

export default {
    client: 'mysql2',
    connection: {
        host: databaseHost,
        port: databasePort,
        database: databaseName,
        user: databaseUserName,
        password: databasePassword
    },
    pool: {
        min: 10,
        max: 30,
        idleTimeoutMillis: 60000,
    },
    acquireConnectionTimeout: 20000,
    migrations: {
        tableName: 'migrations',
        directory: __dirname + '/./database/migrations',
        loadExtensions: ['.js']
    },
    seeds: {
        directory: __dirname + '/./database/seeds',
        loadExtensions: ['.js']
    },
}