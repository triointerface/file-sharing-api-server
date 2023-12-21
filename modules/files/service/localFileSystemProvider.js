// fileAccess.js

import { existsSync, mkdirSync, promises, constants, createReadStream } from 'fs';
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
    const publicFileName = `${publicKey}`;
    const filePath = join(this.rootFolder, publicFileName);

    // Write the file to the specified path
    await promises.writeFile(filePath, file.buffer);

    return { publicKey, filePath };
  }

  // Method to download a file
  async downloadFile(publicKey) {
    const privateFileName = `${publicKey}`;
    const privatePath = join(this.rootFolder, privateFileName);

    // Check if the file exists, and if so, create a readable stream
    if (await promises.access(privatePath, constants.F_OK).then(() => true).catch(() => false)) {
      return createReadStream(privatePath);
    } else {
      throw new Error('File not found');
    }
  }

  // Method to remove a file
  async removeFile(privateKey) {
    const privatePath = join(this.rootFolder, privateKey);

    // Check if the file exists, and if so, unlink it
    if (await promises.access(privatePath, constants.F_OK).then(() => true).catch(() => false)) {
      await promises.unlink(privatePath);
      return { message: 'File removed successfully' };
    } else {
      throw new Error('File not found');
    }
  }
}

export default FileAccess;
