const router = require('express').Router();
const { registerForEvent, getMyEvents, getEventRegistrations, markAttendance, unregisterFromEvent } = require('../controllers/registrationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', protect, authorizeRoles('student'), registerForEvent);
router.get('/my-events', protect, authorizeRoles('student'), getMyEvents);
router.get('/event/:eventId', protect, authorizeRoles('organizer', 'admin'), getEventRegistrations);
router.put('/attendance/:id', protect, authorizeRoles('organizer'), markAttendance);
router.delete('/unregister/:eventId', protect, authorizeRoles('student'), unregisterFromEvent);

module.exports = router;
