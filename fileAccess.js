// fileAccess.js

const fs = require('fs');
const path = require('path');
const GoogleCloudStorageProvider = require('./googleCloudStorageProvider');
const LocalFileSystemProvider = require('./localFileSystemProvider');

class FileAccess {
  constructor(config) {
    this.provider = config.PROVIDER === 'google'
      ? new GoogleCloudStorageProvider(config.CONFIG)
      : new LocalFileSystemProvider(config.FOLDER);
  }

  async uploadFile(file) {
    return this.provider.uploadFile(file);
  }

  async downloadFile(publicKey) {
    return this.provider.downloadFile(publicKey);
  }

  async removeFile(privateKey) {
    return this.provider.removeFile(privateKey);
  }
}

module.exports = FileAccess;
