const router = require('express').Router();

const {
  studentRegister,
  verifyEmail,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  login,
  studentLogin,
  adminLogin,
  organizerLogin,
  getMe,
  googleCallback,
  googleFailure,
  googleLoginWithToken,
  testEmailConfig
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const passport = require('passport');


// ================= AUTH ROUTES =================

// Register
router.post('/register', studentRegister);

// Email Verification
router.post('/verify-email', verifyEmail);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/verify/:token', verifyResetToken);
router.post('/reset-password', resetPassword);

// ================= LOGIN ROUTES =================

// Generic login route supporting all roles
router.post('/login', login);

// Student Login
router.post('/login/student', studentLogin);

// Admin Login
router.post('/login/admin', adminLogin);
router.post('/admin/login', adminLogin);

// Organizer Login
router.post('/login/organizer', organizerLogin);
router.post('/organizer/login', organizerLogin);


// ================= GOOGLE LOGIN =================

router.post('/google-login', googleLoginWithToken);


// ================= USER ROUTES =================

// Current Logged User
router.get('/me', protect, getMe);

// Test Email Configuration
router.get('/test-email', testEmailConfig);


// ================= GOOGLE OAUTH =================

// Google Auth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure'
  }),
  googleCallback
);

// Google Failure
router.get('/google/failure', googleFailure);


module.exports = router;