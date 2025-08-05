// routes/jobPost.js
const express = require('express');
const router = express.Router();
const JobPost = require('../models/JobPost');
const Employer = require('../models/Employer');
const ApplicationModel = require('../models/Application'); // Adjust path as needed
const ApplicantModel = require('../models/Applicant'); // Adjust path as needed
const { applyForJob } = require('../controllers/applicationController');

// Create a new job post (Pending by default)
// Create a new job post (Pending by default)

router.post('/apply', applyForJob);


router.get('/', async (req, res) => {
  try {
    const jobPosts = await JobPost.find({ status: 'approved' })
      .populate('employerId', 'businessName businessImage') // Populating employer details
      .exec();

    res.status(200).json(jobPosts);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Error fetching job posts' });
  }
});

router.get('/employers/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.json(employer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employer data' });
  }
});


router.get('/employer', async (req, res) => {
  const { employerId, status } = req.query;
  try {
    const jobPosts = await JobPost.find({ employerId, status: status || 'pending' })
      .populate('employerId', 'businessName businessImage');
    res.json(jobPosts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching job posts' });
  }
});

// router.post('/create', async (req, res) => {
//   try {
//     const { employerId, address, position, schedule, salaryRate, quota } = req.body;

//     // Validate all required fields including quota
//     if (!employerId || !address || !position || !schedule || !salaryRate || !quota) {
//       return res.status(400).json({ error: 'All fields are required including quota.' });
//     }

//     // Optionally validate quota is a positive number
//     if (typeof quota !== 'number' && typeof quota !== 'string') {
//       return res.status(400).json({ error: 'Quota must be a number.' });
//     }

//     const quotaNumber = Number(quota);
//     if (isNaN(quotaNumber) || quotaNumber <= 0) {
//       return res.status(400).json({ error: 'Quota must be a positive number.' });
//     }

//     const newJob = new JobPost({
//       employerId,
//       address,
//       position,
//       schedule,
//       salaryRate,
//       quota: quotaNumber,
//       status: 'pending'  // or default status
//     });

//     await newJob.save();

//     res.status(201).json({ message: 'Job post created and is pending approval.', job: newJob });
//   } catch (error) {
//     console.error('Error creating job post:', error);
//     res.status(500).json({ error: 'Failed to create job post.', details: error.message });
//   }
// });

router.post('/create', async (req, res) => {
  try {
    const { employerId, address, position, schedule, salaryRate, salaryRateType, quota } = req.body;

    if (!employerId || !address || !position || !schedule || !salaryRate || !quota) {
      return res.status(400).json({ error: 'All fields are required including quota.' });
    }

    const quotaNumber = Number(quota);
    if (isNaN(quotaNumber) || quotaNumber <= 0) {
      return res.status(400).json({ error: 'Quota must be a positive number.' });
    }

    // ✅ Fix: store result in a variable
    const existingJob = await JobPost.findOne({
      employerId,
      position,
      schedule,
      status: { $in: ['approved', 'pending'] }
    });

    if (existingJob) {
      return res.status(409).json({
        error: 'You already have a job post with this position and schedule.',
      });
    }

    const newJob = new JobPost({
      employerId,
      address,
      position,
      schedule,
      salaryRate,
      salaryRateType: salaryRateType || 'per hour',
      quota: quotaNumber,
      status: 'pending',
    });

    await newJob.save();

    const employer = await Employer.findById(employerId);
    if (employer && !employer.savedPositions.includes(position)) {
      employer.savedPositions.push(position);
      await employer.save();
    }

    res.status(201).json({
      message: 'Job post created and is pending approval.',
      job: newJob,
    });
  } catch (error) {
    console.error('Error creating job post:', error);
    res.status(500).json({
      error: 'Failed to create job post.',
      details: error.message,
    });
  }
});



router.get('/pending', async (req, res) => {
  try {
    const pendingJobs = await JobPost.find({ status: 'pending' });

    // Now run the population
    const populatedJobs = await JobPost.find({ status: 'pending' })
      .populate('employerId', 'businessName businessImage');

    console.log('Populated Jobs:', populatedJobs); // Check if population worked
    res.json(populatedJobs);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.put('/status/:id', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  // Optional: you can restrict allowed statuses here
  const allowedStatuses = ['approved', 'rejected', 'dismissed', 'pending', 'pending_dismissal'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const updatedJob = await JobPost.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job post not found.' });
    }

    res.status(200).json({ message: 'Job status updated.', job: updatedJob });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status.' });
  }
});



router.get('/pending-applicants/:employerId', async (req, res) => {
  const { employerId } = req.params;
  try {
    const applications = await ApplicationModel.find({
      employerId: employerId,
      status: 'pending'
    }).populate('applicantId'); // Populates all applicant fields

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error });
  }
});

router.put('/dismiss/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: 'Dismissal reason is required.' });
  }

  try {
    const job = await JobPost.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job post not found.' });
    }

    job.status = 'pending_dismissal';  // <-- new status to indicate admin review needed
    job.dismissalReason = reason;
    await job.save();

    res.json({ message: 'Dismissal request sent, waiting for admin approval.', job });
  } catch (error) {
    console.error('Error requesting dismissal:', error);
    res.status(500).json({ message: 'Failed to request dismissal.' });
  }
});

// Get all job posts that are pending dismissal (For admin review)
router.get('/pending-dismissal', async (req, res) => {
  try {
    const jobs = await JobPost.find({ status: 'pending_dismissal' })
      .populate('employerId', 'businessName businessImage');

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs pending dismissal:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});




module.exports = router;
