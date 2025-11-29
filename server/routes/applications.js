// routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const JobPost = require('../models/JobPost');
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken');
const Feedback = require('../models/Feedback');
const ApplicantFeedback = require('../models/ApplicantFeedback');
const TutorApplication = require('../models/TutorApplication');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');


router.post('/apply', upload.single('applicationLetter'), async (req, res) => {
  console.log('=== Incoming Application Request ===');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const { jobId, applicantId, employerId } = req.body;
  const letterFile = req.file ? req.file.filename : null;


  // Basic validation
  if (!jobId || !applicantId || !employerId || !letterFile) {
    console.log('Validation failed: missing required fields or file');
    return res.status(400).json({
      error: 'All fields and application letter are required.',
      receivedBody: req.body,
      receivedFile: req.file,
    });
  }

  try {
    // Check if applicant already has an approved job
    const approvedApplication = await Application.findOne({
      applicantId,
      status: 'approved',
    });
    if (approvedApplication) {
      console.log('Applicant already has an approved job:', approvedApplication);
      return res.status(400).json({
        error: 'You already have a current job. You cannot apply for another.',
        existingApplication: approvedApplication,
      });
    }

    // Check if applicant already applied to this job
    const exists = await Application.findOne({ jobId, applicantId });
    if (exists) {
      console.log('Applicant already applied for this job:', exists);
      return res.status(400).json({
        error: 'You have already applied for this job.',
        existingApplication: exists,
      });
    }

    // Create new application
    const newApplication = new Application({
      jobId,
      applicantId,
      employerId,
      applicationLetter: letterFile,
      status: 'pending',
    });

    await newApplication.save();
    console.log('Application saved successfully:', newApplication);

    res.status(201).json({
      message: 'Application submitted successfully.',
      application: newApplication,
    });
  } catch (error) {
    console.error('Server error while applying:', error);
    res.status(500).json({ error: 'Server error while applying.' });
  }
});

// router.post('/apply', async (req, res) => {
//   const { jobId, applicantId, employerId } = req.body;

//   try {
//     // Validate input
//     if (!jobId || !applicantId || !employerId) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }
    
//     // Check if the applicant already has an approved job
//     const approvedApplication = await Application.findOne({
//       applicantId,
//       status: 'approved',
//     });

//     if (approvedApplication) {
//       return res.status(400).json({
//         error: 'You already have a current job. You cannot apply for another.',
//       });
//     }

//     // Check if the applicant has already applied for this job
//     const existingApplication = await Application.findOne({ jobId, applicantId });
//     if (existingApplication) {
//       return res
//         .status(400)
//         .json({ error: 'You have already applied for this job.' });
//     }

//     // Create a new application
//     const newApplication = new Application({
//       jobId,
//       applicantId,
//       employerId,
//       status: 'pending', // Initial status for the application
//     });

//     // Save the application
//     await newApplication.save();

//     return res.status(201).json({
//       message: 'Application submitted successfully.',
//       application: newApplication,
//     });
//   } catch (error) {
//     console.error('Error applying for job:', error);
//     return res.status(500).json({ error: 'An error occurred while applying for the job.' });
//   }
// });

// routes/applications.js
// In your applications route handler
router.get('/pending-applicants/:employerId', async (req, res) => {
  const { employerId } = req.params;

  try {
    // Fetch applications with pending status for the employer
    const pendingApplicants = await Application.find({ employerId, status: 'pending' })
      .populate('applicantId', 'firstName lastName email profilePicture')
      .populate('jobId', 'position schedule salaryRate');

    res.status(200).json(pendingApplicants);
  } catch (error) {
    console.error('Error fetching pending applicants:', error);
    res.status(500).json({ error: 'An error occurred while fetching pending applicants.' });
  }
});

router.get('/approved-applicants/:employerId', async (req, res) => {
  const { employerId } = req.params;

  try {
    // Fetch applications with status 'approved' or 'completed'
    const applications = await Application.find({
      employerId,
      status: { $in: ['approved', 'completed'] },
    })
      .populate('applicantId', 'firstName lastName email profilePicture')
      .populate('jobId', 'position schedule salaryRate');

    // Filter out those with feedback
    const filteredApplications = [];

    for (const app of applications) {
      const feedbackExists = await Feedback.exists({
        applicationId: app._id, // ✅ Use application-level uniqueness
      });

      if (!feedbackExists) {
        filteredApplications.push({
          ...app.toObject(),
          feedbackGiven: false,
        });
      }
    }

    res.status(200).json(filteredApplications);
  } catch (error) {
    console.error('Error fetching approved/completed applicants:', error);
    res.status(500).json({ error: 'An error occurred while fetching applicants.' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "jwt-secret-key");
    req.user = decoded; // This attaches the token payload
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
// In your /job-applications route
router.get('/job-applications', authenticate, async (req, res) => {
  console.log("Request user:", req.user); // Log the decoded user data

  const applicantId = req.user?.applicantId; // ✅ Match the key from the JWT

  if (!applicantId) {
    return res.status(400).json({ error: "Applicant ID is required" });
  }

  try {
    const jobApplications = await Application.find({ applicantId })
      .populate('jobId', 'position schedule salaryRate')  // Populate the job fields (position, schedule, salaryRate)
      .populate('employerId', 'businessName businessImage'); // Populate employer fields from the job's employerId

    res.status(200).json(jobApplications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /api/applications/approved/:applicantId
router.get('/approved/:applicantId', async (req, res) => {
  try {
    const jobs = await Application.find({
      applicantId: req.params.applicantId,
      status: 'approved'
    }).populate('jobId').populate('employerId', 'businessName businessImage'); // or populate 'employerId' if needed
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// router.get("/completed/:applicantId", async (req, res) => {
//   try {
//     const { applicantId } = req.params;

//     const completedApplications = [];

//     // --- ✅ Fetch approved job applications ---
//     const approvedJobs = await Application.find({
//       applicantId,
//       status: "approved"
//     })
//       .populate("jobId")
//       .populate("employerId");

//     for (const app of approvedJobs) {
//       const hasEmployerFeedback = await ApplicantFeedback.exists({
//         applicantId,
//         receiverId: app.employerId?._id,
//         receiverModel: "employer"
//       });

//       if (hasEmployerFeedback) {
//         completedApplications.push({
//           ...app.toObject(),
//           type: "job"
//         });
//       }
//     }

//     // --- ✅ Fetch approved tutor applications ---
//     const approvedTutors = await TutorApplication.find({
//       applicantId,
//       status: "approved"
//     })
//       .populate("tutorPostId")
//       .populate("parentId");

//     for (const app of approvedTutors) {
//       const hasParentFeedback = await ApplicantFeedback.exists({
//         applicantId,
//         receiverId: app.parentId?._id,
//         receiverModel: "parent"
//       });

//       if (hasParentFeedback) {
//         completedApplications.push({
//           ...app.toObject(),
//           type: "tutor"
//         });
//       }
//     }

//     res.status(200).json(completedApplications);
//   } catch (err) {
//     console.error("❌ Failed to fetch completed applications with feedback:", err);
//     res.status(500).json({ message: "Server error while fetching completed applications." });
//   }
// });

router.get('/completed/:applicantId', async (req, res) => {
  try {
    const { applicantId } = req.params;

    // Fetch completed job applications
    const jobApps = await Application.find({
      applicantId,
      status: 'completed',
    })
      .populate('jobId')
      .populate('employerId');

    // Fetch completed tutor applications
    const tutorApps = await TutorApplication.find({
      applicantId,
      status: 'completed',
    })
      .populate('tutorPostId')
      .populate('parentId');

    // Fetch all applicant feedback
    const feedbacks = await ApplicantFeedback.find({ applicantId });

    const findFeedbackDate = (receiverId, receiverModel) => {
      const match = feedbacks.find(
        (fb) =>
          fb.receiverId.toString() === receiverId.toString() &&
          fb.receiverModel === receiverModel
      );
      return match?.createdAt || null;
    };

    const formattedJobApps = jobApps.map((app) => ({
      type: 'job',
      company: app.employerId?.businessName || 'Unknown',
      position: app.jobId?.position || 'N/A',
      schedule: app.jobId?.schedule || 'N/A',
      completionDate: findFeedbackDate(app.employerId?._id, 'employer'),
    }));

    const formattedTutorApps = tutorApps.map((app) => ({
      type: 'tutor',
      company: app.parentId?.fullName || 'Parent',
      position: app.tutorPostId?.tutorType || 'N/A',
      schedule: app.tutorPostId?.schedule || 'N/A',
      completionDate: findFeedbackDate(app.parentId?._id, 'parent'),
    }));

    const allCompleted = [...formattedJobApps, ...formattedTutorApps];

    res.status(200).json(allCompleted);
  } catch (error) {
    console.error('Error fetching completed apps:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/cancel/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending applications can be cancelled.' });
    }

    // Option 1: Change status to cancelled
    application.status = 'cancelled';
    await application.save();

    // Option 2 (if you prefer to delete): await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Application cancelled successfully.' });
  } catch (error) {
    console.error('Cancel application error:', error);
    res.status(500).json({ message: 'Server error while cancelling application.' });
  }
});

// ❌ Delete a rejected application
router.delete('/delete/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (application.status !== 'rejected') {
      return res.status(400).json({ message: 'Only rejected applications can be deleted.' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error while deleting application.' });
  }
});


module.exports = router;
