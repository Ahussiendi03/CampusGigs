const mongoose = require('mongoose');

const TutorPostSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'parent', required: true },
  tutorType: { type: String, required: true },
  address: { type: String, required: true },
  schedule: { type: String, required: true },
  salary: { type: String, required: true },
  quota: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'pending_dismissal', 'dismissed', 'archived'], 
    default: 'pending' 
  },
  dismissalReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TutorPost', TutorPostSchema);
