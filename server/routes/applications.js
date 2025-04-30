// routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const JobPost = require('../models/JobPost');
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken');



router.post('/apply', async (req, res) => {
  const { jobId, applicantId, employerId } = req.body;

  try {
    // Validate input
    if (!jobId || !applicantId || !employerId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if the applicant has already applied for this job
    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ error: 'You have already applied for this job.' });
    }

    // Create a new application
    const newApplication = new Application({
      jobId,
      applicantId,
      employerId,
      status: 'pending', // Initial status for the application
    });

    // Save the application
    await newApplication.save();

    return res.status(201).json({
      message: 'Application submitted successfully.',
      application: newApplication,
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    return res.status(500).json({ error: 'An error occurred while applying for the job.' });
  }
});
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
    // Fetch applications with approved status for the given employer
    const approvedApplicants = await Application.find({ employerId, status: 'approved' })
      .populate('applicantId', 'firstName lastName email profilePicture') // Populate applicant details
      .populate('jobId', 'position schedule salaryRate'); // Populate job details

    // Respond with the approved applicants
    res.status(200).json(approvedApplicants);
  } catch (error) {
    console.error('Error fetching approved applicants:', error);
    res.status(500).json({ error: 'An error occurred while fetching approved applicants.' });
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






module.exports = router;
