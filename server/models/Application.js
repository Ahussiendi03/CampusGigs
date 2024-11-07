const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  applicationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
