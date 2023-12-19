// fileAccess.js

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileAccess {
  constructor(rootFolder) {
    this.rootFolder = rootFolder;
  }

  // Method to upload a file
  async uploadFile(file) {
    const publicKey = uuidv4();
    const privateFileName = `${publicKey}_${file.originalname}`;
    const privatePath = path.join(this.rootFolder, privateFileName);

    // Write the file to the specified path
    await fs.promises.writeFile(privatePath, file.buffer);

    return { publicKey, privateKey: privateFileName };
  }

  // Method to download a file
  async downloadFile(publicKey) {
    const privateFileName = `${publicKey}`;
    const privatePath = path.join(this.rootFolder, privateFileName);

    // Check if the file exists, and if so, create a readable stream
    if (await fs.promises.access(privatePath, fs.constants.F_OK).then(() => true).catch(() => false)) {
      return fs.createReadStream(privatePath);
    } else {
      throw new Error('File not found');
    }
  }

  // Method to remove a file
  async removeFile(privateKey) {
    const privatePath = path.join(this.rootFolder, privateKey);

    // Check if the file exists, and if so, unlink it
    if (await fs.promises.access(privatePath, fs.constants.F_OK).then(() => true).catch(() => false)) {
      await fs.promises.unlink(privatePath);
      return { message: 'File removed successfully' };
    } else {
      throw new Error('File not found');
    }
  }
}

module.exports = FileAccess;
