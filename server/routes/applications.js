// routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

router.post('/apply', async (req, res) => {
  try {
    const { jobId, applicantId, employerId } = req.body;

    // Validate input
    if (!jobId || !applicantId || !employerId) {
      return res.status(400).json({ message: 'Job ID, Applicant ID, and Employer ID are required.' });
    }

    // Create application with a pending status
    const application = await Application.create({
      jobId,
      applicantId,
      employerId,
      status: 'pending',
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Server error while creating application:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
