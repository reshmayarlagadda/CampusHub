const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Organizer = require('../models/Organizer');
const crypto = require('crypto');
const { generateToken, generateOTP } = require('../utils/generateToken');
const { sendOTPEmail, sendResetPasswordEmail } = require('../utils/emailService');

// ====== STUDENT REGISTER ======
exports.studentRegister = async (req, res) => {
  try {
    const { regNo, email, password } = req.body;
    if (!regNo || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const normalizedEmail = email.toString().trim().toLowerCase();
    const normalizedRegNo = regNo.toString().trim();

    const student = await Student.findOne({ regNo: normalizedRegNo, email: normalizedEmail });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found in college database. Contact admin.' });
    if (student.hasRegistered) return res.status(400).json({ success: false, message: 'Account already exists. Please login.' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    student.password = password;
    student.otp = otp;
    student.otpExpiry = otpExpiry;
    await student.save();

    const previewUrl = await sendOTPEmail(email, student.name, otp);

    const responsePayload = {
      success: true,
      message: 'OTP sent to your college email. Please verify.',
    };
    if (previewUrl) {
      responsePayload.previewUrl = previewUrl;
      responsePayload.otp = otp; // only for dev/test mode
    }

    res.status(200).json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== VERIFY EMAIL OTP ======
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toString().trim().toLowerCase();
    const normalizedOtp = otp.toString().trim();

    const student = await Student.findOne({ email: normalizedEmail });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (student.hasRegistered) return res.status(400).json({ success: false, message: 'Already verified' });
    if (String(student.otp).trim() !== normalizedOtp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (student.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP expired. Please register again.' });

    student.isVerified = true;
    student.hasRegistered = true;
    student.otp = undefined;
    student.otpExpiry = undefined;
    await student.save();

    const token = generateToken(student._id, 'student');
    res.status(200).json({ success: true, message: 'Email verified successfully!', token, role: 'student', user: { id: student._id, name: student.name, email: student.email, regNo: student.regNo } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== PASSWORD RESET REQUEST ======
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const normalizedEmail = email.toString().trim().toLowerCase();
    const student = await Student.findOne({ email: normalizedEmail });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    student.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    student.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await student.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    try {
      const previewUrl = await sendResetPasswordEmail(student.email, student.name, resetUrl);
      
      const responsePayload = {
        success: true,
        message: 'Password reset link sent to your email.',
      };
      if (previewUrl) responsePayload.previewUrl = previewUrl;

      res.status(200).json(responsePayload);
    } catch (emailErr) {
      console.error('❌ Email sending error:', emailErr.message);
      console.error('Stack:', emailErr.stack);
      
      // Provide more specific error messages
      let userMessage = 'Failed to send reset email. Please try again later.';
      
      if (emailErr.message.includes('connect ECONNREFUSED') || emailErr.message.includes('ENOTFOUND')) {
        userMessage = 'Email service is temporarily unavailable. Please try again in a few moments.';
      } else if (emailErr.message.includes('Invalid login') || emailErr.message.includes('authentication failed')) {
        userMessage = 'Email service configuration error. Please contact the administrator.';
      }
      
      return res.status(500).json({ success: false, message: userMessage, error: emailErr.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== PASSWORD RESET TOKEN VERIFY ======
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ success: false, message: 'Invalid reset token' });

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const student = await Student.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!student) return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired' });

    res.status(200).json({ success: true, message: 'Reset token is valid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== PASSWORD RESET ======
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password are required' });

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const student = await Student.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!student) return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired' });

    student.password = password;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;
    await student.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== STUDENT LOGIN ======
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const normalizedEmail = email.toString().trim().toLowerCase();
    const student = await Student.findOne({ email: normalizedEmail }).select('+password');
    if (!student) return res.status(404).json({ success: false, message: 'Invalid credentials. Please check email, password, and selected role.' });
    if (!student.hasRegistered) return res.status(401).json({ success: false, message: 'Account not activated. Please register first.' });
    if (!student.isVerified) return res.status(401).json({ success: false, message: 'Email not verified.' });

    const isMatch = await student.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials. Please check email, password, and selected role.' });

    const token = generateToken(student._id, 'student');
    res.status(200).json({ success: true, token, role: 'student', user: { id: student._id, name: student.name, email: student.email, regNo: student.regNo, branch: student.branch, year: student.year } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== ADMIN LOGIN ======
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const normalizedEmail = email.toString().trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
    if (!admin) return res.status(404).json({ success: false, message: 'Invalid credentials. Please check email, password, and selected role.' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials. Please check email, password, and selected role.' });

    const token = generateToken(admin._id, 'admin');
    res.status(200).json({ success: true, token, role: 'admin', user: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== ORGANIZER LOGIN ======
exports.organizerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const normalizedEmail = email.toString().trim().toLowerCase();
    const organizer = await Organizer.findOne({ email: normalizedEmail }).select('+password').populate('clubId');
    if (!organizer) return res.status(404).json({ success: false, message: 'Invalid credentials. Please check email, password, and selected role.' });
    if (!organizer.isActive) return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' });

    const isMatch = await organizer.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials. Please check email, password, and selected role.' });

    const token = generateToken(organizer._id, 'organizer');
    res.status(200).json({ success: true, token, role: 'organizer', user: { id: organizer._id, name: organizer.name, email: organizer.email, club: organizer.clubId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== GENERIC LOGIN ======
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password and role are required' });
  }

  const normalizedRole = role.toString().trim().toLowerCase();

  if (normalizedRole === 'student') return exports.studentLogin(req, res);
  if (normalizedRole === 'admin') return exports.adminLogin(req, res);
  if (normalizedRole === 'organizer') return exports.organizerLogin(req, res);

  return res.status(400).json({ success: false, message: 'Invalid role specified for login' });
};

// ====== GET CURRENT USER ======
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user.data, role: req.user.role });
};

// ====== GOOGLE LOGIN CALLBACK ======
exports.googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Google authentication failed' });
    }

    const student = req.user;
    const token = generateToken(student._id, 'student');

    res.json({
      success: true,
      token,
      role: 'student',
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        regNo: student.regNo,
        branch: student.branch,
        year: student.year,
        profileImage: student.profileImage,
        provider: student.provider
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== GOOGLE LOGIN WITH TOKEN ======
exports.googleLoginWithToken = async (req, res) => {
  try {
    const { token, role } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Google token is required' });
    }

    // Verify the Google token (you need to decode the JWT)
    // For now, we'll assume the token is valid and contains user info
    // In production, verify with Google's servers
    const jwt = require('jsonwebtoken');
    let decodedToken;
    
    try {
      // Try to decode without verification first to get user info
      decodedToken = jwt.decode(token);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    if (!decodedToken || !decodedToken.email) {
      return res.status(401).json({ success: false, message: 'Invalid Google token structure' });
    }

    const email = decodedToken.email.toLowerCase().trim();
    
    // Find or create student
    let student = await Student.findOne({ email });
    
    if (!student) {
      // Create new student from Google data
      student = new Student({
        email,
        name: decodedToken.name || 'Google User',
        googleId: decodedToken.sub || decodedToken.jti,
        provider: 'google',
        isVerified: true,
        hasRegistered: true,
        profileImage: decodedToken.picture || null,
      });
      await student.save();
    } else {
      // Update existing student with Google info if not already linked
      if (!student.googleId) {
        student.googleId = decodedToken.sub || decodedToken.jti;
        student.provider = 'google';
        if (!student.profileImage && decodedToken.picture) {
          student.profileImage = decodedToken.picture;
        }
        await student.save();
      }
    }

    const authToken = generateToken(student._id, 'student');
    res.status(200).json({
      success: true,
      token: authToken,
      role: 'student',
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        regNo: student.regNo,
        branch: student.branch,
        year: student.year,
        profileImage: student.profileImage,
        provider: student.provider
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ====== GOOGLE LOGIN FAILURE ======
exports.googleFailure = (req, res) => {
  res.status(401).json({ success: false, message: 'Google authentication failed' });
};

// ====== TEST EMAIL CONFIGURATION ======
exports.testEmailConfig = async (req, res) => {
  const { getEmailServiceStatus } = require('../utils/emailService');
  try {
    const status = getEmailServiceStatus();
    const message = status.isInitialized 
      ? (status.hasError 
        ? `Email service has configuration error: ${status.error}`
        : (status.usingTestAccount
          ? 'Email service is using test account (Ethereal). Real emails not being sent to addresses.'
          : 'Email service is properly configured and ready to send emails'))
      : 'Email service not initialized';
    
    res.status(status.hasError ? 500 : 200).json({
      success: !status.hasError,
      message,
      ...status
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to check email status', error: err.message });
  }
};
