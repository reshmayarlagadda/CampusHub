const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.registrationDeadline && new Date() > event.registrationDeadline)
      return res.status(400).json({ success: false, message: 'Registration deadline passed' });

    const existing = await Registration.findOne({ studentId: req.user.id, eventId });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered for this event' });

    if (event.maxParticipants) {
      const count = await Registration.countDocuments({ eventId });
      if (count >= event.maxParticipants) return res.status(400).json({ success: false, message: 'Event is full' });
    }

    const registration = await Registration.create({ studentId: req.user.id, eventId });
    res.status(201).json({ success: true, message: 'Registered successfully!', registration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get student's registered events
exports.getMyEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.user.id })
      .populate({ path: 'eventId', populate: { path: 'organizerId', select: 'name' } })
      .sort({ registeredAt: -1 });
    res.status(200).json({ success: true, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get registrations for an event (organizer)
exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate('studentId', 'name regNo email branch year')
      .sort({ registeredAt: -1 });
    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { attendanceStatus } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { attendanceStatus },
      { new: true }
    ).populate('studentId', 'name regNo');
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, message: 'Attendance updated', registration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Unregister from event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const reg = await Registration.findOne({ studentId: req.user.id, eventId: req.params.eventId });
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    await reg.deleteOne();
    res.status(200).json({ success: true, message: 'Unregistered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
