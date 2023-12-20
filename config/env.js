require('dotenv').config({path: __dirname+'/../.env'})

module.exports  = {
    maxUploadRequests: process.env.MAX_UPLOAD_REQUESTS || 10,
    maxDownloadRequests: process.env.MAX_DOWNLOAD_REQUESTS || 10,
    provider: process.env.PROVIDER || 'local',
    folder: process.env.FOLDER || './uploads',
    config: process.env.CONFIG,
    cleanUpCorn: process.env.CLEANUP_CRON || '0 0 * * *',
    port: process.env.PORT || 3000,
    databaseHost: process.env.DATABASE_HOST,
    databasePort: process.env.DATABASE_PORT,
    databaseUserName: process.env.DATABASE_USERNAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME
}