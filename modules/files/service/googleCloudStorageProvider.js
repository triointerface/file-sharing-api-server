// googleCloudStorageProvider.js

import { Storage } from '@google-cloud/storage';

class GoogleCloudStorageProvider {
  constructor(configPath) {
    // Load configuration from the provided file
    const config = require(configPath);

    // Initialize Google Cloud Storage client
    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });

    this.bucketName = config.bucketName;
  }

  async uploadFile(file) {
    const publicKey = file.originalname;
    const privatePath = `files/${publicKey}`;
    const fileBuffer = file.buffer;

    await this.storage.bucket(this.bucketName).file(privatePath).createWriteStream().end(fileBuffer);

    return { publicKey, privateKey: privatePath };
  }

  async downloadFile(publicKey) {
    const privatePath = `files/${publicKey}`;

    const [file] = await this.storage.bucket(this.bucketName).file(privatePath).get();

    if (!file) {
      throw new Error('File not found');
    }

    return this.storage.bucket(this.bucketName).file(privatePath).createReadStream();
  }

  async removeFile(privateKey) {
    const privatePath = `files/${privateKey}`;

    try {
      await this.storage.bucket(this.bucketName).file(privatePath).delete();
      return { message: 'File removed successfully' };
    } catch (error) {
      throw new Error('File not found');
    }
  }
}

export default GoogleCloudStorageProvider;
