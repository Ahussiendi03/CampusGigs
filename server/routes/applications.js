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

// routes/applications.js
router.get('/pending-applicants/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    const pendingApplications = await Application.find({ employerId, status: 'pending' })
      .populate('applicantId', 'firstName lastName email contactNumber'); // Assuming `applicantId` links to Applicant

    res.status(200).json(pendingApplications);
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
