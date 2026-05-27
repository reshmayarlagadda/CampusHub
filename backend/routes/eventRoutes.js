const router = require('express').Router();
const { createEvent, getAllEvents, getEvent, updateEvent, deleteEvent, getOrganizerEvents } = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadBanner } = require('../config/cloudinary');

router.get('/', getAllEvents);
router.get('/my-events', protect, authorizeRoles('organizer'), getOrganizerEvents);
router.get('/:id', getEvent);
router.post('/create', protect, authorizeRoles('organizer'), uploadBanner.single('banner'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer', 'admin'), uploadBanner.single('banner'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;
