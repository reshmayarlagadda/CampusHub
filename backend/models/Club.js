const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  clubName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  facultyCoordinator: { type: String, trim: true },
  clubImage: { type: String },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Literary', 'Social', 'Other'],
    default: 'Other',
  },
  members: [
    {
      fullName: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
      rollNumber: { type: String, trim: true },
      department: { type: String, trim: true },
      year: { type: String, trim: true },
      message: { type: String, trim: true },
      joinedAt: { type: Date, default: Date.now },
    }
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Club', clubSchema);
