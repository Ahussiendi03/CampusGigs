// routes/applicants.js
const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/Applicant');
const FeedbackModel = require('../models/Feedback'); // import your Feedback model
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const ApplicantFeedback = require('../models/ApplicantFeedback');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const applicant = await ApplicantModel.findOne({ email: req.user.email });
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    // Count feedbacks given by applicant where a rating was provided
    const jobsCompleted = await ApplicantFeedback.countDocuments({
      applicantId: applicant._id,
      rating: { $gt: 0 }  // only count if rating is given and greater than 0
    });

    // Calculate experience and level capped at 30
    const experience = applicant.experience || 0;
    const level = Math.min(Math.floor(experience / 100) + 1, 30);

    // Determine rank based on level
    let rank;
    if (level >= 21) {
      rank = 'Expert';       // Gold
    } else if (level >= 11) {
      rank = 'Intermediate'; // Silver
    } else {
      rank = 'Beginner';     // Bronze
    }

    res.json({
      experience,
      rank,
      jobsCompleted,
      level,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/my', authMiddleware, async (req, res) => {
  try {
    const applicant = await ApplicantModel.findById(req.user.applicantId); // Make sure req.user.id comes from token
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put(
  '/update',
  authMiddleware,
  upload.fields([
    { name: 'schoolId', maxCount: 1 },
    { name: 'cor', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      // If files exist, attach their filenames to updateData
      if (req.files['schoolId']) {
        updateData.schoolId = req.files['schoolId'][0].path;
      }
      if (req.files['cor']) {
        updateData.cor = req.files['cor'][0].path;
      }

      const updatedApplicant = await ApplicantModel.findByIdAndUpdate(
        req.user.applicantId,
        { $set: updateData },
        { new: true }
      );

      if (!updatedApplicant) {
        return res.status(404).json({ message: 'Applicant not found' });
      }

      res.json(updatedApplicant);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
module.exports = router;
