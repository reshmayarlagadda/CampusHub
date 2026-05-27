const Student = require('../models/Student');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');
const Organizer = require('../models/Organizer');
const Club = require('../models/Club');
const Admin = require('../models/Admin');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalEvents, totalRegistrations, totalCertificates, totalOrganizers, totalClubs, verifiedStudents, upcomingEvents] = await Promise.all([
      Student.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      Certificate.countDocuments(),
      Organizer.countDocuments(),
      Club.countDocuments(),
      Student.countDocuments({ isVerified: true }),
      Event.countDocuments({ date: { $gte: new Date() } }),
    ]);

    res.status(200).json({
      success: true,
      stats: { totalStudents, totalEvents, totalRegistrations, totalCertificates, totalOrganizers, totalClubs, verifiedStudents, upcomingEvents }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createAdminAccount = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET_KEY)
      return res.status(403).json({ success: false, message: 'Invalid secret key' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Admin already exists' });
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ success: true, message: 'Admin account created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = req.user.data;
    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, collegeName } = req.body;
    const admin = req.user.data;
    admin.name = name ?? admin.name;
    admin.phone = phone ?? admin.phone;
    admin.collegeName = collegeName ?? admin.collegeName;
    await admin.save();
    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
