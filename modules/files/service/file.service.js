// fileService.js
import GoogleCloudStorageProvider from './googleCloudStorageProvider.js';
import LocalFileSystemProvider from './localFileSystemProvider.js';
import { provider, config, folder } from '../../../config/env.js';
import { v4 as uuidv4 } from 'uuid';

class FileService {
  constructor() {
    this.provider = provider === 'global'
      ? new GoogleCloudStorageProvider(config)
      : new LocalFileSystemProvider(folder);
  }

  async uploadFile(file) {
    const response = await this.provider.uploadFile(file);
    const privateKey = uuidv4();
    return {publicKey: response.publicKey, privateKey: response.publicKey};
  }

  async downloadFile(publicKey) {
    return this.provider.downloadFile(publicKey);
  }

  async removeFile(privateKey) {
    return this.provider.removeFile(privateKey);
  }
}

export default FileService;
