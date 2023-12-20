// server.js
const express = require('express');
const multer = require('multer');
const FileAccess = require('./fileAccess');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

const app = express();
const port = env.port;

const fileAccess = new FileAccess();

// Middleware for handling multipart/form-data
const upload = multer();

// Set up rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: env.maxUploadRequests, // Adjust the maximum number of requests
  message: 'Too many upload requests from this IP, please try again later.',
});

// Set up rate limiting for downloads
const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: env.maxDownloadRequests, // Adjust the maximum number of requests
  message: 'Too many download requests from this IP, please try again later.',
});

// Apply rate limiting middleware to specific routes
app.post('/files', uploadLimiter, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const result = await fileAccess.uploadFile(file);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/files/:publicKey', downloadLimiter, async (req, res) => {
  try {
    const publicKey = req.params.publicKey;
    const fileStream = await fileAccess.downloadFile(publicKey);
    fileStream.pipe(res);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/files/:privateKey', async (req, res) => {
  try {
    const privateKey = req.params.privateKey;
    const result = await fileAccess.removeFile(privateKey);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Schedule a daily cleanup job
cron.schedule(env.cleanUpCorn, async () => {
  console.log('Running daily cleanup job...');
  // Add logic here to cleanup files based on inactivity
  // For example, you can delete files older than a certain period
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
