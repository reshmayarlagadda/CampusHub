const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  registrationDeadline: { type: Date },
  category: {
    type: String,
    enum: ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'],
    default: 'Other',
  },
  bannerImage: { type: String },
  maxParticipants: { type: Number },
  isActive: { type: Boolean, default: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
