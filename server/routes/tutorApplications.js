// routes/tutorApplications.js
const express = require('express');
const router = express.Router();
const TutorApplication = require('../models/TutorApplication');
const TutorPost = require('../models/TutorPost');
const Parent = require('../models/Parent');
const Applicant = require('../models/Applicant');
const Feedback = require('../models/Feedback');
const jwt = require('jsonwebtoken');
const ParentFeedbackModel = require('../models/ParentFeedbackModel');
const upload = require('../middleware/upload');


router.post('/apply', upload.single('applicationLetter'), async (req, res) => {
  const { tutorPostId, applicantId, parentId } = req.body;

  if (!tutorPostId || !applicantId || !parentId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const letterFile = req.file ? req.file.path : null;

  try {
    const approved = await TutorApplication.findOne({
      applicantId,
      status: 'approved',
    });

    if (approved) {
      return res.status(400).json({
        error: 'You already have a current job. You cannot apply for another.',
      });
    }

    const existing = await TutorApplication.findOne({ tutorPostId, applicantId });
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this tutor post.' });
    }

    const newApplication = new TutorApplication({
      tutorPostId,
      applicantId,
      parentId,
      applicationLetter: letterFile, // ⭐ SAVE FILE
      status: 'pending',
    });

    await newApplication.save();

    res.status(201).json({ message: 'Application submitted.', application: newApplication });
  } catch (error) {
    console.error('Error applying to tutor post:', error);
    res.status(500).json({ error: 'Server error while applying.' });
  }
});


// Apply for a tutor post
// router.post('/apply', async (req, res) => {
//   const { tutorPostId, applicantId, parentId } = req.body;

//   if (!tutorPostId || !applicantId || !parentId) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   const approvedApplication = await TutorApplication.findOne({
//     applicantId,
//     status: 'approved',
//   });

//   if (approvedApplication) {
//     return res.status(400).json({
//       error: 'You already have a current job. You cannot apply for another.',
//     });
//   }
//   try {
//     // Prevent duplicate applications
//     const existing = await TutorApplication.findOne({ tutorPostId, applicantId });
//     if (existing) {
//       return res.status(400).json({ error: 'Already applied to this tutor post.' });
//     }

//     const newApplication = new TutorApplication({
//       tutorPostId,
//       applicantId,
//       parentId,
//       status: 'pending',
//     });

//     await newApplication.save();

//     res.status(201).json({ message: 'Application submitted.', application: newApplication });
//   } catch (error) {
//     console.error('Error applying to tutor post:', error);
//     res.status(500).json({ error: 'Server error while applying.' });
//   }
// });

// Get all tutor applications for logged-in applicant
router.get('/my-tutor-applications', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'jwt-secret-key');
    const applicantId = decoded.applicantId;

    const applications = await TutorApplication.find({ applicantId })
      .populate('tutorPostId')
      .populate('parentId', 'parentBusinessName');

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tutor applications.' });
  }
});

// GET approved tutor applications for applicant
router.get('/approved/:applicantId', async (req, res) => {
  try {
    const results = await TutorApplication.find({
      applicantId: req.params.applicantId,
      status: 'approved'
    }).populate('tutorPostId').populate('parentId', 'parentBusinessName');

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/pending-applicants/:parentId', async (req, res) => {
  const { parentId } = req.params;

  try {
    const pendingApplicants = await TutorApplication.find({ parentId, status: 'pending' })
      .populate('applicantId', 'firstName lastName email profilePicture')
      .populate('tutorPostId', 'position schedule salary tutorType');

    res.status(200).json(pendingApplicants);
  } catch (error) {
    console.error('Error fetching pending applicants:', error);
    res.status(500).json({ error: 'An error occurred while fetching pending applicants.' });
  }
});

// Approve a tutor application by ID
router.put('/approve/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the application and populate tutorPost info
    const application = await TutorApplication.findById(id).populate('tutorPostId');
    if (!application) {
      return res.status(404).json({ error: 'Tutor application not found' });
    }

    // Check if application is already processed
    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Application already processed' });
    }

    // Check if tutor post is archived (quota full)
    if (application.tutorPostId.status === 'archived') {
      return res.status(400).json({ error: 'Cannot approve application. Tutor post quota is full and archived.' });
    }

    // Approve application
    application.status = 'approved';
    await application.save();

    // Count approved applications for this tutor post
    const approvedCount = await TutorApplication.countDocuments({
      tutorPostId: application.tutorPostId._id,
      status: 'approved',
    });

    // If approved count >= quota, archive the tutor post
    if (approvedCount >= application.tutorPostId.quota) {
      application.tutorPostId.status = 'archived';
      await application.tutorPostId.save();
    }

    res.json({ message: 'Tutor application approved', application });
  } catch (error) {
    console.error('Error approving tutor application:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/approved-applicants/:parentId', async (req, res) => {
  const { parentId } = req.params;

  try {
    // Fetch tutor applications with status 'approved' or 'completed'
    const approvedApplicants = await TutorApplication.find({
      parentId,
      status: { $in: ['approved', 'completed'] },
    })
      .populate('applicantId', 'firstName lastName email profilePicture')
      .populate('tutorPostId', 'position schedule salary tutorType');

    // Filter out applicants that already have feedback from this parent
    const applicantsWithoutFeedback = [];

    for (const app of approvedApplicants) {
      const feedback = await ParentFeedbackModel.findOne({
        applicantId: app.applicantId._id,
        parentId,
      });

      if (!feedback) {
        applicantsWithoutFeedback.push({
          ...app.toObject(),
          feedbackGiven: false,
        });
      }
    }

    res.status(200).json(applicantsWithoutFeedback);
  } catch (error) {
    console.error('Error fetching approved/completed applicants without feedback:', error);
    res.status(500).json({ error: 'An error occurred while fetching applicants.' });
  }
});


module.exports = router;
