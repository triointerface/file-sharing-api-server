import express from 'express';
import fileRouter from './modules/files/router/file.router.js';
import userRouter from './modules/user/router/user.router.js';

const router = express.Router();

router.use('/files', fileRouter);
router.use('/user', userRouter);

export default router;
