const router = require('express').Router();
const { createOrganizer, getAllOrganizers, deleteOrganizer, toggleOrganizer, getOrganizerProfile, updateOrganizerProfile } = require('../controllers/organizerController');
const { organizerLogin } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/login', organizerLogin);
router.post('/create', protect, authorizeRoles('admin'), createOrganizer);
// router.get('/profile', protect, authorizeRoles('organizer'), getOrganizerProfile);
// router.put('/profile', protect, authorizeRoles('organizer'), updateOrganizerProfile);
router.get('/', protect, authorizeRoles('admin'), getAllOrganizers);
router.delete('/:id', protect, authorizeRoles('admin'), deleteOrganizer);
router.patch('/:id/toggle', protect, authorizeRoles('admin'), toggleOrganizer);

module.exports = router;
