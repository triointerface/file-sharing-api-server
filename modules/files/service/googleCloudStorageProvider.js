// googleCloudStorageProvider.js
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

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
    const publicKey = uuidv4();
    const publicFileName = `${publicKey}_${file.originalname}`;
    const url = await this.storage.bucket(this.bucketName).file(publicFileName).createWriteStream().end(file.buffer);
    return { publicKey, filePath: url, provider: 'google' };
  }

  async downloadFile(file) {

    const [file] = await this.storage.bucket(this.bucketName).file(file).get();

    if (!file) {
      throw new Error('File not found');
    }

    return this.storage.bucket(this.bucketName).file(privatePath).createReadStream();
  }

  async removeFile(fileName) {
    try {
      await this.storage.bucket(this.bucketName).file(fileName).delete();
      return { message: 'File removed successfully' };
    } catch (error) {
      throw new Error('File not found');
    }
  }
}

export default GoogleCloudStorageProvider;
