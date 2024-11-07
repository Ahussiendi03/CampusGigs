const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Route for fetching pending applications for a specific employer
router.get('/:employerId/applications', async (req, res) => {
  const { employerId } = req.params;

  try {
    const applications = await Application.find({ employerId, status: 'pending' })
      .populate('applicantId', 'name email')
      .populate('jobId', 'position');

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

module.exports = router;
