// fileAccess.js

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

  // Method to upload a file
  async uploadFile(file) {
    const publicKey = uuidv4();
    const publicFileName = `${publicKey}_${file.originalname}`;
    const filePath = join(this.rootFolder, publicFileName);

    // Write the file to the specified path
    await promises.writeFile(filePath, file.buffer);

    return { publicKey, filePath, provider: 'local' };
  }

  // Method to download a file
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

  // Method to remove a file
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
