// routes/jobPost.js
const express = require('express');
const router = express.Router();
const JobPost = require('../models/JobPost');
const Employer = require('../models/Employer');

// Create a new job post (Pending by default)
// Create a new job post (Pending by default)

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

router.post('/create', async (req, res) => {
    try {
      const { employerId, address, position, schedule, salaryRate } = req.body;
  
      // Check if required fields are present
      if (!employerId || !address || !position || !schedule || !salaryRate) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      const newJob = new JobPost({ employerId, address, position, schedule, salaryRate });
      await newJob.save();
  
      res.status(201).json({ message: 'Job post created and is pending approval.', job: newJob });
    } catch (error) {
      console.error('Error creating job post:', error); // Log the error
      res.status(500).json({ error: 'Failed to create job post.', details: error.message });
    }
  });

// Get all pending job posts (For admin approval)
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





// Approve or reject a job post (Admin action)
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const updatedJob = await JobPost.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job post not found.' });
    }

    res.status(200).json({ message: 'Job status updated.', job: updatedJob });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status.' });
  }
});




module.exports = router;
