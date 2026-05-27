const Certificate = require('../models/Certificate');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

// Upload certificate
exports.uploadCertificate = async (req, res) => {
  try {
    const { regNo, eventId, certificateType } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Certificate file required' });

    // Validate certificate type
    const validTypes = ['participation', 'runner', 'winner'];
    if (!certificateType || !validTypes.includes(certificateType)) {
      return res.status(400).json({ success: false, message: 'Invalid certificate type' });
    }

    const student = await Student.findOne({ regNo });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found with this RegNo' });

    const existing = await Certificate.findOne({ studentId: student._id, eventId, certificateType });
    if (existing) {
      existing.certificateUrl = req.file.path;
      existing.uploadedAt = new Date();
      await existing.save();
      return res.status(200).json({ success: true, message: 'Certificate updated', certificate: existing });
    }

    const certificate = await Certificate.create({
      studentId: student._id,
      eventId,
      certificateUrl: req.file.path,
      certificateType,
    });

    res.status(201).json({ success: true, message: 'Certificate uploaded successfully', certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get my certificates (student)
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user.id })
      .populate('eventId', 'title date venue category')
      .sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, count: certificates.length, certificates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get certificates for an event (organizer)
exports.getEventCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ eventId: req.params.eventId })
      .populate('studentId', 'name regNo email');
    res.status(200).json({ success: true, certificates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete certificate
exports.deleteCertificate = async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
