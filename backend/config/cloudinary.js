const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure backend upload folder exists for local CSV uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage for event banners
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusconnect/banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 600, crop: 'fill' }],
  },
});

// Storage for certificates
const certificateStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusconnect/certificates',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

// Storage for club images
const clubImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusconnect/clubs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Local storage for CSV
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `csv_${Date.now()}_${file.originalname}`),
});

exports.uploadBanner = multer({ storage: bannerStorage });
exports.uploadCertificate = multer({ storage: certificateStorage });
exports.uploadClubImage = multer({ storage: clubImageStorage });
exports.uploadCSV = multer({ storage: csvStorage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) cb(null, true);
  else cb(new Error('Only CSV files allowed'), false);
}});

exports.cloudinary = cloudinary;
