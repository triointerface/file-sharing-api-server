// fileService.js
import GoogleCloudStorageProvider from './googleCloudStorageProvider.js';
import LocalFileSystemProvider from './localFileSystemProvider.js';
import { provider, config, folder } from '../../../config/env.js';
import Database from '../../../database/connection.js';
import Common from '../../../lib/common.js';

class FileService {
  constructor() {
    this.provider = provider === 'global' ? new GoogleCloudStorageProvider(config) : new LocalFileSystemProvider(folder);
  }

  /**
   * @param {File} file - The file to be uploaded. The `file` parameter should be a valid file object,
   * @returns {Promise<Object>} A promise that resolves to an object containing information about the uploaded file.
   * @throws {Error} If the file upload or database insertion fails, an error is thrown with details about the failure.
   */
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

  /**
   * @param {string} publicKey - The public key associated with the file to be downloaded.
   * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the file content.
   * @throws {Error} If the file is not found, an error is thrown with a 'File not found.' message.
   */
  async downloadFile(publicKey) {
    const files = await this.getFileInfo({ public_key: publicKey });
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new Error('File not found.');
    }
    return this.provider.downloadFile(files[0].url);
  }

  /**
   * @param {string} privateKey - The private key associated with the file to be removed.
   * @param {string} userId - The unique identifier of the user who owns the file.
   * @returns {Promise<Object>} A promise that resolves to the response from the file removal operation.
   * @throws {Error} If the file is not found or if the removal operation fails, an error is thrown with details about the failure.
   */
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

  /**
   * @param {Object} data - The data containing information about the file to be inserted.
   * @returns {Promise<Object>} A promise that resolves to an object containing
   * the public and private keys associated with the inserted file.
   * @throws {Error} If the database insertion fails, an error is thrown with details about the failure.
   */
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

  /**
   * @param {string} publicKey - The public key associated with the file information to be deleted.
   * @param {string} privateKey - The private key associated with the file information to be deleted.
   * @returns {Promise<number>} A promise that resolves to the number of rows deleted from the 'files' table.
   * @throws {Error} If the database deletion operation fails, an error is thrown with details about the failure.
   */
  async deleteFileInfo(publicKey, privateKey) {
    return Database('files')
      .where({
        public_key: publicKey,
        private_key: privateKey,
      })
      .del();
  }

  /**
  * @param {Object} searchParam - The search parameters to filter file information.
  * @returns {Promise<Array>} A promise that resolves to an array of file information objects.
  * @throws {Error} If the database retrieval operation fails, an error is thrown with details about the failure.
  */
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
