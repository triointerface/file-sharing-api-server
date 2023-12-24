import rateLimit from 'express-rate-limit';
import { maxUploadRequests, maxDownloadRequests } from './env.js';

export const uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: maxUploadRequests, // Adjust the maximum number of requests
  statusCode: 200,
  message: {
    status: 429,
    limiter: true,
    type: "error",
    errpr: 'maximum_accounts'
  }
});

export const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: maxDownloadRequests, // Adjust the maximum number of requests
  message: 'Too many download requests from this IP, please try again later.',
});
