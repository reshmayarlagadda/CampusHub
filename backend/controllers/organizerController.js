const Organizer = require('../models/Organizer');

exports.createOrganizer = async (req, res) => {
  try {
    const { name, email, password, clubId } = req.body;
    const exists = await Organizer.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Organizer already exists' });
    const organizer = await Organizer.create({ name, email, password, clubId });
    res.status(201).json({ success: true, message: 'Organizer created', organizer: { id: organizer._id, name, email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find().populate('clubId', 'clubName');
    res.status(200).json({ success: true, organizers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteOrganizer = async (req, res) => {
  try {
    await Organizer.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Organizer removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.toggleOrganizer = async (req, res) => {
  try {
    const org = await Organizer.findById(req.params.id);
    if (!org) return res.status(404).json({ success: false, message: 'Not found' });
    org.isActive = !org.isActive;
    await org.save();
    res.status(200).json({ success: true, message: `Organizer ${org.isActive ? 'activated' : 'deactivated'}`, organizer: org });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.user.data._id).populate('clubId', 'clubName');
    if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });
    res.status(200).json({ success: true, organizer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateOrganizerProfile = async (req, res) => {
  try {
    const { name, phone, bio, socialLinks } = req.body;
    const organizer = await Organizer.findById(req.user.data._id);
    if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });
    organizer.name = name ?? organizer.name;
    organizer.phone = phone ?? organizer.phone;
    organizer.bio = bio ?? organizer.bio;
    organizer.socialLinks = socialLinks ?? organizer.socialLinks;
    await organizer.save();
    const updatedOrganizer = await Organizer.findById(organizer._id).populate('clubId', 'clubName');
    res.status(200).json({ success: true, organizer: updatedOrganizer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
