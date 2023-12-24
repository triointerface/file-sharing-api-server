// fileService.js
// eslint-disable-next-line import/no-named-as-default
import GoogleCloudStorageProvider from './googleCloudStorageProvider.js';
import LocalFileSystemProvider from './localFileSystemProvider.js';
import { provider, config, folder } from '../../../config/env.js';
import Database from '../../../database/connection.js';
import Common from '../../../lib/common.js';

class FileService {
  constructor() {
    this.provider = provider === 'global' ? new GoogleCloudStorageProvider(config) : new LocalFileSystemProvider(folder);
  }

  async uploadFile(file, userId) {
    try {
      const response = await this.provider.uploadFile(file);
      if (!response) {
        throw new Error('Failed to upload file');
      }
      const data = {
        public_key: response.publicKey,
        url: response.filePath,
        provider: response.provider,
        file_name: file.originalname,
        mime_type: file.mimetype,
        created_by: userId,
      };
      return this.insertFileInfo(data);
    } catch (e) {
      throw new Error(e.message ? e.message : 'Failed to upload file');
    }
  }

  async downloadFile(publicKey) {
    const files = await this.getFileInfo({ public_key: publicKey });
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new Error('File not found.');
    }
    return this.provider.downloadFile(files[0].url);
  }

  async removeFile(privateKey, userId) {
    const files = await this.getFileInfo({
      private_key: privateKey,
      created_by: userId,
    });
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new Error('File not found.');
    }
    const removeFileResponse = await this.provider.removeFile(files[0].url);
    if (removeFileResponse) {
      await this.deleteFileInfo(files[0].publicKey, files[0].privateKey);
    }
    return removeFileResponse;
  }

  async insertFileInfo(data) {
    return Database.insert(data)
      .into('files')
      .then(async () => {
        const result = await this.getFileInfo({ public_key: data.public_key });
        return {
          publicKey: data.public_key,
          privateKey: result && result.length > 0 ? result[0].privateKey : null,
        };
      });
  }

  async deleteFileInfo(publicKey, privateKey) {
    return Database('files')
      .where({
        public_key: publicKey,
        private_key: privateKey,
      })
      .del();
  }

  async getFileInfo(searchParam = {}) {
    const columns = [
      'f.public_key AS publicKey',
      'f.private_key AS privateKey',
      'f.file_name AS fileName',
      'f.mime_type AS mimeType',
      'f.url AS url',
      'f.provider AS provider',
      'u.id AS userId',
    ];

    const sql = Database.select(columns)
      .from('files as f')
      .leftJoin('users as u', 'f.created_by', 'u.id');

    if (searchParam && Object.prototype.hasOwnProperty.call(searchParam, 'public_key')) {
      sql.andWhere('f.public_key', '=', searchParam.public_key);
    }

    if (searchParam && Object.prototype.hasOwnProperty.call(searchParam, 'private_key')) {
      sql.andWhere('f.private_key', '=', searchParam.private_key);
    }

    if (
      searchParam
      && Object.prototype.hasOwnProperty.call(searchParam, 'created_at')
      && Common.isValidDate(searchParam.created_at)
    ) {
      sql.andWhere('f.created_at', '<=', searchParam.created_at);
      console.log('searchParam.created_at: ', searchParam.created_at);
    }

    if (
      searchParam
      && Object.prototype.hasOwnProperty.call(searchParam, 'created_by')
      && searchParam.created_by > 0
    ) {
      sql.andWhere('f.created_by', '=', searchParam.created_by);
    }
    return sql;
  }
}

export default FileService;
