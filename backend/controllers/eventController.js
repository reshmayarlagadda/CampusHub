const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, venue, date, registrationDeadline, category, maxParticipants, tags, clubId } = req.body;
    const bannerImage = req.file?.path || '';

    const effectiveClubId = clubId || req.user?.data?.clubId;

    const event = await Event.create({
      title, description, venue, date, registrationDeadline, category, maxParticipants,
      bannerImage,
      organizerId: req.user.id,
      clubId: effectiveClubId || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
    });

    const populated = await event.populate('organizerId', 'name email');
    res.status(201).json({ success: true, message: 'Event created', event: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get all events (public)
exports.getAllEvents = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, upcoming } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizerId', 'name email')
      .populate('clubId', 'clubName')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email')
      .populate('clubId', 'clubName description');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const registrationCount = await Registration.countDocuments({ eventId: event._id });
    res.status(200).json({ success: true, event, registrationCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.organizerId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const updates = { ...req.body };
    if (req.file) updates.bannerImage = req.file.path;
    if (updates.tags && typeof updates.tags === 'string') updates.tags = updates.tags.split(',').map(t => t.trim());

    const updated = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Event updated', event: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get organizer's events
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
