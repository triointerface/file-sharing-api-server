// index.js

import express, { json } from 'express';
import cron from 'node-cron';
import { port, cleanUpCorn, environment, isMigrationEnabled } from './config/env.js';
import router from './router.js';
import Database from './database/connection.js';
import removeInactiveFiles from './corn/remove_inactive_file.js';

const app = express();

app.use(json());
app.use('/', [router]);

if (environment !== 'test') {
  if (isMigrationEnabled) {
    Database.migrate.latest().then(() => {
      console.log('Database migrated successfully');
    }).catch(e => {
      console.log(`Failed to migrate database due to: ${e}`);
    });
  }

  try {
    // Schedule a daily cleanup job
    cron.schedule(cleanUpCorn, async () => {
      console.log('Removing inactive files.');
      removeInactiveFiles().then(() => {
        console.log('Removed inactive file successfully');
      }).catch(e => {
        console.log('Failed to remove inactive files');
      });
    });
  } catch (e) {
    console.log('Failed to run cleanup job...');
  }
}

const server = app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});

export default server;
