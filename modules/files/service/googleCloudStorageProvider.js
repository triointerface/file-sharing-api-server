// googleCloudStorageProvider.js
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

class GoogleCloudStorageProvider {
  constructor(configPath) {
    // Load configuration from the provided file
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const config = require(configPath);

    // Initialize Google Cloud Storage client
    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });

    this.bucketName = config.bucketName;
  }

  /**
   * @param {File} file - The file to be uploaded.
   * @todo Implement this function when integrating the Google Cloud Storage provider.
   */
  async uploadFile(file) { }

  /**
   * @param {String} fileURL - The file url to be downloaded.
   * @todo Implement this function when integrating the Google Cloud Storage provider.
   */
  async downloadFile(fileURL) {}

  /**
   * @param {String} fileURL - The file url to be downloaded.
   * @todo Implement this function when integrating the Google Cloud Storage provider.
   */
  async removeFile(fileURL) {}
}

export default GoogleCloudStorageProvider;
