const router = require('express').Router();
const { getDashboardStats, createAdminAccount, getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const { adminLogin } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/stats', protect, authorizeRoles('admin'), getDashboardStats);
// router.get('/profile', protect, authorizeRoles('admin'), getAdminProfile);
// router.put('/profile', protect, authorizeRoles('admin'), updateAdminProfile);
router.post('/create-account', createAdminAccount);

module.exports = router;
