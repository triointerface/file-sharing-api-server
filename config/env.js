// env.mjs
import path from 'path';
const __dirname = path.resolve();

import * as dotenv from 'dotenv';
dotenv.config({path: __dirname+'/.env'});

export const maxUploadRequests = process.env.MAX_UPLOAD_REQUESTS || 10
export const maxDownloadRequests = process.env.MAX_DOWNLOAD_REQUESTS || 1000
export const provider = process.env.PROVIDER || 'local'
export const folder = process.env.FOLDER || './uploads'
export const config = process.env.CONFIG
export const cleanUpCorn = process.env.CLEANUP_CRON || '0 0 * * *'
export const port = process.env.PORT || 3000
export const databaseHost = process.env.DATABASE_HOST
export const databasePort = process.env.DATABASE_PORT || 3306
export const databaseUserName = process.env.DATABASE_USERNAME
export const databasePassword = process.env.DATABASE_PASSWORD
export const databaseName = process.env.DATABASE_NAME;
export const jwtPrivateKey = (process.env.ENVIRONMENT || 'local') === 'production' ? process.env.JWT_PRIVATE_KEY_PRODUCATION : process.env.JWT_PRIVATE_KEY_LOCAL ;