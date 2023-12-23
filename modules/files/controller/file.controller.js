// file.controller.js
import FileService from '../service/file.service.js';

const fileService = new FileService();

class FileController {
  constructor() {
  }

  async uploadFile(req, res) {
    try {
      const { file } = req;
      const result = await fileService.uploadFile(file, req.user.id);
      res.json(result);
    } catch (error) {
      res.status(415).json({ error: error.message });
    }
  }

  async getFileByPublicKey(req, res) {
    try {
      const { publicKey } = req.params;
      const fileStream = await fileService.downloadFile(publicKey);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteFileByPrivateKey(req, res) {
    try {
      const { privateKey } = req.params;
      const userId = req.user.id;
      const result = await fileService.removeFile(privateKey, userId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
export default FileController;
