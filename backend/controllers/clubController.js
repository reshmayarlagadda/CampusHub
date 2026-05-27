const Club = require('../models/Club');
const Event = require('../models/Event');

exports.createClub = async (req, res) => {
  try {
    const { clubName, description, facultyCoordinator, category } = req.body;
    const clubImage = req.file?.path || '';
    const club = await Club.create({ clubName, description, facultyCoordinator, category, clubImage });
    res.status(201).json({ success: true, message: 'Club created', club });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true });
    const eventsByClub = await Event.aggregate([
      { $match: { isActive: true, clubId: { $ne: null } } },
      { $group: { _id: '$clubId', count: { $sum: 1 } } },
    ]);

    const eventCounts = eventsByClub.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const clubsWithCounts = clubs.map((club) => ({
      ...club.toObject(),
      eventCount: eventCounts[club._id.toString()] || 0,
    }));

    res.status(200).json({ success: true, clubs: clubsWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateClub = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.clubImage = req.file.path;
    const club = await Club.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, club });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getClubMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    res.status(200).json({ success: true, members: club.members || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMembershipStatus = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    const members = club.members || [];
    let isMember = false;
    if (req.user?.data?.email) {
      const userEmail = req.user.data.email.toLowerCase();
      isMember = members.some((member) => member.email?.toLowerCase() === userEmail);
    }
    res.status(200).json({ success: true, isMember });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getClubEvents = async (req, res) => {
  try {
    const events = await Event.find({ clubId: req.params.id, isActive: true })
      .populate('organizerId', 'name email')
      .sort({ date: 1 });

    res.status(200).json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.joinClub = async (req, res) => {
  try {
    const { fullName, email, rollNumber, department, year, message } = req.body;
    if (!fullName || !email || !rollNumber || !department || !year) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const normalizedEmail = email.toLowerCase();
    club.members = club.members || [];
    const alreadyMember = club.members.some(
      (member) => member.email?.toLowerCase() === normalizedEmail || member.rollNumber === rollNumber
    );
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this club.' });
    }

    club.members.push({
      fullName,
      email: normalizedEmail,
      rollNumber,
      department,
      year,
      message,
      joinedAt: new Date(),
    });

    await club.save();
    res.status(200).json({ success: true, message: 'You have joined the club.', members: club.members });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Club deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
