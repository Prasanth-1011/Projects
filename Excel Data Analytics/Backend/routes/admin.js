const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin, requireRoot } = require('../middleware/roleMiddleware');

router.get('/pending-admins', authMiddleware, requireRoot, adminController.getPendingAdmins);
router.put('/activate-admin/:adminId', authMiddleware, requireRoot, adminController.activateAdmin);
router.put('/promote-root/:adminId', authMiddleware, requireRoot, adminController.promoteToRoot);
router.put('/revoke-root/:adminId', authMiddleware, requireRoot, adminController.revokeRoot);
router.delete('/deactivate-user/:userId', authMiddleware, requireRoot, adminController.deactivateUser);
router.get('/users', authMiddleware, requireAdmin, adminController.getAllUsers);
router.get('/admins', authMiddleware, requireAdmin, adminController.getAllAdmins);
router.get('/files', authMiddleware, requireAdmin, adminController.getAllFiles);
router.get('/activity', authMiddleware, requireAdmin, adminController.getUserActivity);
router.get('/stats', authMiddleware, requireAdmin, adminController.getDashboardStats);

module.exports = router;