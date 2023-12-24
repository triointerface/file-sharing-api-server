import path from 'path';
import {
  databaseHost,
  databasePassword,
  databaseUserName,
  databasePort,
  databaseName,
} from './config/env.js';

const dirname = path.resolve();

export default {
  client: 'mysql2',
  connection: {
    host: databaseHost,
    port: databasePort,
    database: databaseName,
    user: databaseUserName,
    password: databasePassword,
  },
  pool: {
    min: 10,
    max: 30,
    idleTimeoutMillis: 60000,
  },
  acquireConnectionTimeout: 20000,
  migrations: {
    tableName: 'migrations',
    directory: `${dirname}/./database/migrations`,
    loadExtensions: ['.js'],
  },
  seeds: {
    directory: `${dirname}/./database/seeds`,
    loadExtensions: ['.js'],
  },
};
