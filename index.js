// index.js

import express, { json } from 'express';
import cron from 'node-cron';
import { port, cleanUpCorn } from './config/env.js';
import router from './router.js';

const app = express();

app.use(json());
app.use('/', [router]);

// // Schedule a daily cleanup job
cron.schedule(cleanUpCorn, async () => {
  console.log('Running daily cleanup job...');
  // Add logic here to cleanup files based on inactivity
  // For example, you can delete files older than a certain period
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
