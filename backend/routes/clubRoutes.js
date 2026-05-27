const router = require('express').Router();
const { createClub, getAllClubs, updateClub, deleteClub, getClubMembers, getClubEvents, getMembershipStatus, joinClub } = require('../controllers/clubController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadClubImage } = require('../config/cloudinary');

router.get('/', getAllClubs);
router.get('/:id/members', getClubMembers);
router.get('/:id/events', getClubEvents);
router.get('/:id/membership-status', getMembershipStatus);
router.post('/:id/join', joinClub);
router.post('/create', protect, authorizeRoles('admin'), uploadClubImage.single('clubImage'), createClub);
router.put('/:id', protect, authorizeRoles('admin'), uploadClubImage.single('clubImage'), updateClub);
router.delete('/:id', protect, authorizeRoles('admin'), deleteClub);

module.exports = router;
