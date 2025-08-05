const mongoose = require('mongoose');

const ApplicantFeedbackSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'applicant',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel', // Dynamically choose either employer or parent
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['employer', 'parent'], // Must match one of these models
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ApplicantFeedback = mongoose.model('applicantFeedback', ApplicantFeedbackSchema);

module.exports = ApplicantFeedback;
