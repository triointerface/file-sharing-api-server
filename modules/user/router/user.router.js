// 'use strict'
import express from 'express';
import UserController from '../controller/user.controller.js';
import AuthMiddleWare from '../../../middleware/auth.middleware.js';

// express router
const router = express.Router();

const userController = new UserController();

// User router
router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete('/remove-account', AuthMiddleWare, userController.removeAccount);

export default router;
