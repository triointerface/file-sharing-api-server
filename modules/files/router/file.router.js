// file.router.js
import express from 'express';
const router = express.Router();

import FileController from '../controller/file.controller.js';
import { uploadLimiter, downloadLimiter } from '../../../config/rate-limit.js';
import multer from 'multer';

const fileController = new FileController();

// Middleware for handling multipart/form-data
const upload = new multer();

// File routes
router.post('', uploadLimiter, upload.single('file'), fileController.uploadFile);
router.get('/:publicKey', downloadLimiter, fileController.getFileByPublicKey);
router.delete('/:privateKey', fileController.deleteFileByPrivateKey);

export default router;