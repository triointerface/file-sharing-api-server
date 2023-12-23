import rateLimit from 'express-rate-limit';
import { maxUploadRequests, maxDownloadRequests } from './env.js';

export const uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: maxUploadRequests, // Adjust the maximum number of requests
  message: 'Too many upload requests from this IP, please try again later.',
});

export const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: maxDownloadRequests, // Adjust the maximum number of requests
  message: 'Too many download requests from this IP, please try again later.',
});
