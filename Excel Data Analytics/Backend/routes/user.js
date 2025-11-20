const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/files', authMiddleware, userController.getUserFiles);
router.get('/stats', authMiddleware, userController.getUserStats);
router.post('/increment-visualization', authMiddleware, userController.incrementVisualization);
router.post('/increment-download', authMiddleware, userController.incrementDownload);

module.exports = router;