const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ApplicantFeedback = require('../models/ApplicantFeedback');
const Application = require('../models/Application');
const TutorApplication = require('../models/TutorApplication');


// POST: Create feedback from applicant to employer or parent
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     // Inline semester check
//     const now = new Date();
//     const year = now.getFullYear();
//     const mayEnd = new Date(`${year}-05-31T23:59:59`);
//     const decEnd = new Date(`${year}-12-31T23:59:59`);

//     const isAfterMay = now > mayEnd;
//     const isAfterDec = now > decEnd;

//     if (!(isAfterMay || isAfterDec)) {
//       return res.status(403).json({
//         message: 'You can only give feedback at the end of the semester (end of May or December).'
//       });
//     }

//     const { applicantId, receiverId, receiverModel, rating, comments } = req.body;

//     if (!['employer', 'parent'].includes(receiverModel)) {
//       return res.status(400).json({ error: 'receiverModel must be either employer or parent' });
//     }

//     const feedback = new ApplicantFeedback({
//       applicantId,
//       receiverId,
//       receiverModel,
//       rating,
//       comments,
//     });

//     await feedback.save();
//     res.status(201).json({ message: 'Feedback submitted successfully', feedback });
//   } catch (error) {
//     console.error('Error submitting feedback:', error);
//     res.status(500).json({ error: 'Server error while submitting feedback' });
//   }
// });


router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      applicantId,
      receiverId,
      receiverModel,
      rating,
      comments,
      postId // corresponds to jobId or tutorPostId
    } = req.body;

    if (!applicantId || !receiverId || !receiverModel || !rating || !postId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (!['employer', 'parent'].includes(receiverModel)) {
      return res.status(400).json({ error: 'receiverModel must be either employer or parent' });
    }

    // Prevent duplicate feedback for the same post/application
   // Check if feedback already submitted for this receiver and post
    // const existingFeedback = await ApplicantFeedback.findOne({
    //   receiverId,
    //   postId,
    // });

    // if (existingFeedback) {
    //   return res.status(409).json({ error: 'Feedback already submitted for this post.' });
    // }


    // Save feedback
    const feedback = new ApplicantFeedback({
      applicantId,
      receiverId,
      receiverModel,
      postId,
      rating,
      comments,
    });

    await feedback.save();

    // Update application status to 'completed'
    let applicationUpdateResult;

    if (receiverModel === 'employer') {
      applicationUpdateResult = await Application.findOneAndUpdate(
        {
          applicantId,
          employerId: receiverId,
          jobId: postId,
          status: 'approved'
        },
        { status: 'completed' }
      );
    } else if (receiverModel === 'parent') {
      applicationUpdateResult = await TutorApplication.findOneAndUpdate(
        {
          applicantId,
          parentId: receiverId,
          tutorPostId: postId,
          status: 'approved'
        },
        { status: 'completed' }
      );
    }

    if (!applicationUpdateResult) {
      return res.status(404).json({ message: 'Related approved application not found for the given post.' });
    }

    res.status(201).json({
      message: 'Feedback submitted successfully. Application marked as completed.',
      feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Server error while submitting feedback' });
  }
});






// router.get('/:receiverModel/:receiverId', async (req, res) => {
//   try {
//     const { receiverModel, receiverId } = req.params;

//     // Validate receiverModel
//     if (!['employer', 'parent'].includes(receiverModel)) {
//       return res.status(400).json({ error: 'receiverModel must be either employer or parent' });
//     }

//     // Validate receiverId format
//     if (!mongoose.Types.ObjectId.isValid(receiverId)) {
//       return res.status(400).json({ error: 'Invalid receiverId format' });
//     }

//     const receiverObjectId = mongoose.Types.ObjectId(receiverId);

//     // Query feedbacks matching receiverModel and receiverId (as ObjectId)
//     const feedbacks = await ApplicantFeedback.find({ receiverModel, receiverId: receiverObjectId })
//       .populate('applicantId', 'firstName lastName') // applicant's name fields
//       .sort({ createdAt: -1 });

//     res.status(200).json(feedbacks);
//   } catch (error) {
//     console.error('Error fetching feedback:', error);
//     res.status(500).json({ error: 'Server error while fetching feedback' });
//   }
// });

router.get('/my-feedbacks', authMiddleware, async (req, res) => {
    try {
      // Use employerId or parentId depending on role
      let receiverId;
      if (req.user.role === 'employer') {
        receiverId = req.user.employerId;
      } else if (req.user.role === 'parent') {
        receiverId = req.user.parentId;
      } else {
        return res.status(400).json({ message: 'Invalid user role' });
      }
  
  
      const feedbacks = await ApplicantFeedback.find({
        receiverId,
        receiverModel: req.user.role,
      })
        .populate('applicantId', 'firstName lastName')
        .sort({ createdAt: -1 });
  
      console.log('Feedbacks found:', feedbacks.length);
  
      res.json(feedbacks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error fetching feedbacks' });
    }
  });

  

module.exports = router;
