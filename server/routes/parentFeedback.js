const express = require('express');
const router = express.Router();
const ParentFeedback = require('../models/ParentFeedbackModel');  // Your parent feedback model
const ApplicantModel = require('../models/Applicant');   // Same applicant model as employer feedback

router.post('/', async (req, res) => {
  try {
    const { applicantId, parentId, applicationId, rating, comment } = req.body;

    // Validate required fields
    if (!applicantId || !parentId || !applicationId || typeof rating !== 'number') {
      return res.status(400).json({ message: 'applicantId, parentId, applicationId, and a numeric rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Check for existing feedback for this application
    const existingFeedback = await ParentFeedback.findOne({ applicationId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this application.' });
    }

    // Create feedback
    const feedback = new ParentFeedback({
      applicantId,
      parentId,
      applicationId,
      rating,
      comment,
    });

    await feedback.save();

    // Update experience and rank
    const expToAdd = rating * 10;
    const applicant = await ApplicantModel.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    applicant.experience = (applicant.experience || 0) + expToAdd;

    if (applicant.experience >= 2100) {
      applicant.rank = 'Expert';
    } else if (applicant.experience >= 1100) {
      applicant.rank = 'Intermediate';
    } else {
      applicant.rank = 'Beginner';
    }

    await applicant.save();

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback, applicant });

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});



module.exports = router;
