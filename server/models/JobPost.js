const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'employer' },
  address: { type: String, required: true },
  position: { type: String, required: true },
  schedule: { type: String, required: true },
  salaryRate: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

const JobPost = mongoose.model('JobPost', JobPostSchema);
module.exports = JobPost;
