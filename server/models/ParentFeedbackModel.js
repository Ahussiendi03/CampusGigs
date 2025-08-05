// models/ParentFeedbackModel.js
const mongoose = require('mongoose');

const parentFeedbackSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parent',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: false,
  },
createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ParentFeedback', parentFeedbackSchema);
