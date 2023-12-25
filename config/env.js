// env.js
import corn from 'node-cron';
import path from 'path';
import * as dotenv from 'dotenv';

const dirname = path.resolve();
dotenv.config({ path: `${dirname}/.env` });

export const maxUploadRequests = process.env.MAX_UPLOAD_REQUESTS || 50;
export const maxDownloadRequests = process.env.MAX_DOWNLOAD_REQUESTS || 200;
export const provider = process.env.PROVIDER || 'local';
export const folder = process.env.FOLDER || './uploads';
export const config = process.env.CONFIG;
export const cleanUpCorn = corn.validate(process.env.CLEANUP_CRON)
  ? process.env.CLEANUP_CRON
  : '* * * * *';
export const port = process.env.PORT || 3000;
export const databaseHost = process.env.DATABASE_HOST;
export const databasePort = process.env.DATABASE_PORT || 3306;
export const databaseUserName = process.env.DATABASE_USERNAME;
export const databasePassword = process.env.DATABASE_PASSWORD;
export const databaseName = process.env.DATABASE_NAME;
export const jwtPrivateKey = (process.env.ENVIRONMENT || 'local') === 'production'
  ? process.env.JWT_PRIVATE_KEY_PRODUCATION
  : process.env.JWT_PRIVATE_KEY_LOCAL;
export const environment = process.env.ENVIRONMENT;
export const isMigrationEnabled = (+process.env.MIGRATION_ENABLED || 1) === 1;
