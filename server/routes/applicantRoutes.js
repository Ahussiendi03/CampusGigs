const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { applyForJob, approveApplication, rejectApplication } = require('../controllers/applicationController');
const ApplicantModel = require('../models/Applicant');
const authMiddleware = require('../middleware/authMiddleware'); // adjust path as needed

// Public route (no auth needed)
router.post('/applications', applyForJob);

// Protected routes — only accessible with valid token
router.put('/approve/:applicationId', authMiddleware, approveApplication);
router.put('/reject/:applicationId', authMiddleware, rejectApplication);


router.get('/applicant-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const applicant = await ApplicantModel.findById(id);
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json(applicant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
