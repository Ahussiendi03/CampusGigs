// models/TutorApplication.js
const mongoose = require('mongoose');

const tutorApplicationSchema = new mongoose.Schema({
  tutorPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TutorPost',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'applicant',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parent',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  applicationDate: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('TutorApplication', tutorApplicationSchema);
