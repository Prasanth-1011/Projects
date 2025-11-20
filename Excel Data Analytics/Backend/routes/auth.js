const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-user', authController.verifyUser);
router.post('/reset-password', authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;