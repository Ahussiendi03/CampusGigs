const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'employer' },
  address: { type: String, required: true },
  position: { type: String, required: true },
  schedule: { type: String, required: true },
  salaryRate: { type: String, required: true },
  salaryRateType: { type: String, enum: ['per hour', 'per day'], default: 'per hour' },
  quota: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'pending_dismissal', 'dismissed', 'archived'], 
    default: 'pending' 
  },  
  dismissalReason: { type: String },
},{ timestamps: true });

const JobPost = mongoose.model('JobPost', JobPostSchema);
module.exports = JobPost;
