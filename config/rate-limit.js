import rateLimit from 'express-rate-limit';
import { maxUploadRequests, maxDownloadRequests } from './env.js';

export const uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: maxUploadRequests, // Adjust the maximum number of requests
  statusCode: 429,
  message: {
    error: 'Daily upload limit exceeded. Please try again tomorrow.'
  }
});

export const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: maxDownloadRequests, // Adjust the maximum number of requests
  statusCode: 429,
  message: {
    error: 'Daily download limit exceeded. Please try again tomorrow.'
  },
});
