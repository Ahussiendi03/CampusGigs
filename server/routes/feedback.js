const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const ApplicantModel = require('../models/Applicant');
const ParentFeedback = require('../models/ParentFeedbackModel');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/feedback - create feedback and update applicant experience & rank
// router.post('/', async (req, res) => {
//   try {
//     const { applicantId, employerId, rating, comments } = req.body;

//     if (!applicantId || !employerId || !rating) {
//       return res.status(400).json({ message: 'applicantId, employerId, and rating are required.' });
//     }

//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
//     }

//     // ✅ Check if feedback already exists
//     const existingFeedback = await Feedback.findOne({ applicantId, employerId });
//     if (existingFeedback) {
//       return res.status(400).json({ message: 'Feedback has already been submitted for this applicant by this employer.' });
//     }

//     // Create feedback document
//     const feedback = new Feedback({
//       applicantId,
//       employerId,
//       rating,
//       comments
//     });

//     await feedback.save();

//     // Update applicant's experience & rank
//     const expToAdd = rating * 10;

//     const applicant = await ApplicantModel.findById(applicantId);
//     if (!applicant) {
//       return res.status(404).json({ message: 'Applicant not found.' });
//     }

//     applicant.experience = (applicant.experience || 0) + expToAdd;

//     // Update rank
//     if (applicant.experience >= 2100) {
//       applicant.rank = 'Expert';
//     } else if (applicant.experience >= 1100) {
//       applicant.rank = 'Intermediate';
//     } else {
//       applicant.rank = 'Beginner';
//     }

//     await applicant.save();

//     res.status(201).json({ message: 'Feedback saved and applicant updated.', feedback, applicant });

//   } catch (error) {
//     console.error('Error saving feedback:', error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { applicationId, applicantId, employerId, rating, comments } = req.body;

    // Validate required fields
    if (!applicationId || !applicantId || !employerId || !rating) {
      return res.status(400).json({ message: 'applicationId, applicantId, employerId, and rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // ✅ Check if feedback already exists for this application
    const existingFeedback = await Feedback.findOne({ applicationId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this application.' });
    }

    // Create feedback document
    const feedback = new Feedback({
      applicationId,
      applicantId,
      employerId,
      rating,
      comments
    });

    await feedback.save();

    // Update applicant's experience & rank
    const expToAdd = rating * 10;

    const applicant = await ApplicantModel.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    applicant.experience = (applicant.experience || 0) + expToAdd;

    // Update rank
    if (applicant.experience >= 2100) {
      applicant.rank = 'Expert';
    } else if (applicant.experience >= 1100) {
      applicant.rank = 'Intermediate';
    } else {
      applicant.rank = 'Beginner';
    }

    await applicant.save();

    res.status(201).json({ message: 'Feedback saved and applicant updated.', feedback, applicant });

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// GET /api/feedback/me
// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const applicantId = req.user.applicantId;
//     console.log('Applicant ID:', applicantId);

//     const feedbacks = await Feedback.find({ applicantId })
//       .populate('employerId', 'businessName businessImage')
//       .exec();

//     console.log('Found feedbacks:', feedbacks.length);

//     res.json(feedbacks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error while fetching feedback' });
//   }
// });

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const applicantId = req.user.applicantId;
    console.log('Applicant ID:', applicantId);

    // Fetch employer feedbacks
    const employerFeedbacks = await Feedback.find({ applicantId })
      .populate('employerId', 'businessName businessImage')
      .exec();

    // Fetch parent feedbacks
    const parentFeedbacks = await ParentFeedback.find({ applicantId })
      .populate('parentId', 'email')  // Adjust fields you want from parent
      .exec();

    console.log('Found employer feedbacks:', employerFeedbacks.length);
    console.log('Found parent feedbacks:', parentFeedbacks.length);

    res.json({
      employerFeedbacks,
      parentFeedbacks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching feedback' });
  }
});




module.exports = router;
