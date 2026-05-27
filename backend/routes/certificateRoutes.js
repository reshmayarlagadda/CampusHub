const router = require('express').Router();
const { uploadCertificate, getMyCertificates, getEventCertificates, deleteCertificate } = require('../controllers/certificateController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadCertificate: uploadCertFile } = require('../config/cloudinary');

router.post('/upload', protect, authorizeRoles('organizer'), uploadCertFile.single('certificate'), uploadCertificate);
router.get('/my-certificates', protect, authorizeRoles('student'), getMyCertificates);
router.get('/event/:eventId', protect, authorizeRoles('organizer', 'admin'), getEventCertificates);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteCertificate);

module.exports = router;
