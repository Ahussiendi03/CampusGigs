const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { applyForJob, approveApplication, rejectApplication } = require('../controllers/applicationController');
const ApplicantModel = require('../models/Applicant');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware'); // adjust path as needed

// Public route (no auth needed)
router.post('/applications', applyForJob);

// Protected routes — only accessible with valid token
router.put('/approve/:applicationId', authMiddleware, approveApplication);
router.put('/reject/:applicationId', authMiddleware, rejectApplication);


router.get('/applicant-profile/:applicantId/:jobId', async (req, res) => {
  const { applicantId, jobId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(applicantId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const applicant = await ApplicantModel.findById(applicantId).select(
      'firstName lastName email streetAddress profilePicture cor schoolId'
    );

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Get application letter for this specific job
    const application = await Application.findOne({
      applicantId,
      jobId,
    }).select('applicationLetter status');

    res.status(200).json({
      ...applicant.toObject(),
      applicationLetter: application?.applicationLetter || null,
      applicationStatus: application?.status || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
