const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'applicant', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'employer', required: true },
  applicationLetter: {
    type: String,
    required: true
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  applicationDate: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Application', applicationSchema);
