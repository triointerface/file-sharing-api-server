// file.controller.js
import FileService from '../service/file.service.js';

const fileService = new FileService();

class FileController {

  constructor() {
    // this.fileService = new FileService();
  }

  async uploadFile(req, res) {
    try {
      const file = req.file;
      console.log('file: ', file);
      const result = await fileService.uploadFile(file);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFileByPublicKey(req, res) {
    try {
      const publicKey = req.params.publicKey;
      const fileStream = await fileService.downloadFile(publicKey);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteFileByPrivateKey(req, res) {
    try {
      const privateKey = req.params.privateKey;
      const result = await fileService.removeFile(privateKey);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
export default FileController;