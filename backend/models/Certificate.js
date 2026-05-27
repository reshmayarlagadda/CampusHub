const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  certificateUrl: { type: String, required: true },
  certificateType: { 
    type: String, 
    enum: ['participation', 'runner', 'winner'], 
    default: 'participation',
    required: true 
  },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', certificateSchema);
