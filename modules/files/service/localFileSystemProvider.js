import {
  existsSync,
  mkdirSync,
  promises,
  constants,
  createReadStream,
} from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

class FileAccess {
  constructor(rootFolder) {
    this.rootFolder = rootFolder;
    if (!existsSync(this.rootFolder)) {
      mkdirSync(this.rootFolder);
    }
  }

  /**
 * @param {object} file - The file to be uploaded.
 * @returns {Promise<{publicKey: string, filePath: string, provider: string}>} - A promise that resolves to an object containing
 * the public key, file path, and provider information associated with the uploaded file.
 * @throws {Error} - Throws an error if the file upload fails.
 */
  async uploadFile(file) {
    const publicKey = uuidv4();
    const publicFileName = `${publicKey}_${file.originalname}`;
    const filePath = join(this.rootFolder, publicFileName);

    // Write the file to the specified path
    await promises.writeFile(filePath, file.buffer);

    return { publicKey, filePath, provider: 'local' };
  }

  /**
 * @param {string} filePath - The absolute path to the file to be downloaded.
 * @returns {Promise<ReadStream>} - A promise that resolves to a readable stream representing the file.
 * @throws {Error} - Throws an error if the file is not found.
 */
  async downloadFile(filePath) {
    // Check if the file exists, and if so, create a readable stream
    if (
      await promises
        .access(filePath, constants.F_OK)
        .then(() => true)
        .catch(() => false)
    ) {
      return createReadStream(filePath);
    }
    throw new Error('File not found');
  }

  /**
 * @param {string} filePath - The absolute path to the file to be removed.
 * @returns {Promise<{message: string}>} - A promise that resolves to an object containing a success message after file removal.
 * @throws {Error} - Throws an error if the file is not found or if the removal operation fails.
 */
  async removeFile(filePath) {
    // Check if the file exists, and if so, unlink it
    if (
      await promises
        .access(filePath, constants.F_OK)
        .then(() => true)
        .catch(() => false)
    ) {
      await promises.unlink(filePath);
      return { message: 'File removed successfully' };
    }
    throw new Error('File not found');
  }
}

export default FileAccess;
