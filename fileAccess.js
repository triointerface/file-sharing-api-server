// fileAccess.js
const GoogleCloudStorageProvider = require('./googleCloudStorageProvider');
const LocalFileSystemProvider = require('./localFileSystemProvider');
const env = require('./config/env');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

class FileAccess {
  constructor() {
    this.provider = env.provider === 'google'
      ? new GoogleCloudStorageProvider(env.config)
      : new LocalFileSystemProvider(env.folder);
  }

  async uploadFile(file) {
    const response = await this.provider.uploadFile(file);
    console.log('response: ', response);
    const privateKey = uuidv4();
    const query = `INSERT INTO meldcx.files (public_key, private_key, file_path) values ("${response.publicKey}", "${privateKey}", "${response.filePath.toString()}") returning *`;
    console.log('query: ', query);
    const result = await db.query(query);
    console.log(result);
    return response;
    
  }

  async downloadFile(publicKey) {
    return this.provider.downloadFile(publicKey);
  }

  async removeFile(privateKey) {
    return this.provider.removeFile(privateKey);
  }
}

module.exports = FileAccess;
