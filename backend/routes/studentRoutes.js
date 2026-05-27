const router = require('express').Router();
const { uploadStudentCSV, getAllStudents, getStudentProfile, updateStudentProfile, deleteStudent } = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadCSV } = require('../config/cloudinary');

router.post('/upload-csv', protect, authorizeRoles('admin'), uploadCSV.single('file'), uploadStudentCSV);
router.get('/', protect, authorizeRoles('admin', 'organizer'), getAllStudents);
router.get('/profile', protect, authorizeRoles('student'), getStudentProfile);
router.put('/profile', protect, authorizeRoles('student'), updateStudentProfile);
router.delete('/:id', protect, authorizeRoles('admin'), deleteStudent);

module.exports = router;
