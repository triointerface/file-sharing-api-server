// file.controller.js
import FileService from '../service/file.service.js';

const fileService = new FileService();

class FileController {
  /**
  * Upload file
  * @param {Object} req - The Express.js request object.
  * @param {Object} res - The Express.js response object.
  * @returns {void} - Sends a JSON response to the client.
  */
  async uploadFile(req, res) {
    try {
      const { file } = req;
      const result = await fileService.uploadFile(file, req.user.id);
      res.json(result);
    } catch (error) {
      res.status(202).json({ error: error.message });
    }
  }

  /** 
   * @param {Object} req - The Express.js request object containing the public key as a parameter.
   * @param {Object} res - The Express.js response object.
   * @returns {void} - Streams the file content to the client as a response or sends a JSON error response if the file is not found.
   */

  async downloadFile(req, res) {
    try {
      const { publicKey } = req.params;
      const fileStream = await fileService.downloadFile(publicKey);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * @param {Object} req - The Express.js request object containing the private key as a parameter.
   * @param {Object} res - The Express.js response object.
   * @returns {void} - Sends a JSON response to the client indicating the success of the file removal or sends a JSON error response if the file is not found.
   */
  async removeFile(req, res) {
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
