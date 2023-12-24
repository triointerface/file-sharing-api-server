// file.controller.js
import FileService from '../service/file.service.js';

const fileService = new FileService();

class FileController {
  static async uploadFile(req, res) {
    try {
      const { file } = req;
      const result = await fileService.uploadFile(file, req.user.id);
      res.json(result);
    } catch (error) {
      res.status(202).json({ error: error.message });
    }
  }

  static async getFileByPublicKey(req, res) {
    try {
      const { publicKey } = req.params;
      const fileStream = await fileService.downloadFile(publicKey);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteFileByPrivateKey(req, res) {
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
