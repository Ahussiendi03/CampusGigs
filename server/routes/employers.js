const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Employer = require('../models/Employer');

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

// GET /api/employers/:employerId/positions
router.get('/:employerId/positions', async (req, res) => {
  try {

    const employer = await Employer.findById(req.params.employerId);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json({ positions: employer.savedPositions || [] });
  } catch (err) {
    console.error('Error fetching saved positions:', err);
    res.status(500).json({ message: 'Failed to fetch saved positions' });
  }
});



module.exports = router;
