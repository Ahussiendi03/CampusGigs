const express = require('express');
const router = express.Router();
const TutorPost = require('../models/TutorPost');
const Parent = require('../models/Parent'); // Assuming you have this model

// Create a new tutor post (Pending by default)
router.post('/create', async (req, res) => {
  try {
    const { parentId, tutorType, schedule, salary, quota, address } = req.body;

    // Validate all required fields
    if (!parentId || !tutorType || !schedule || !salary || !quota || !address) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate quota and salary are positive numbers
    if (isNaN(Number(quota)) || Number(quota) <= 0) {
      return res.status(400).json({ error: 'Quota must be a positive number.' });
    }
    if (isNaN(Number(salary)) || Number(salary) <= 0) {
      return res.status(400).json({ error: 'Salary must be a positive number.' });
    }

    // Create new tutor post with status pending
    const newTutorPost = new TutorPost({
      parentId,
      tutorType,
      schedule,
      salary,
      quota: Number(quota),
      address,
      status: 'pending'
    });

    await newTutorPost.save();

    res.status(201).json({ message: 'Tutor post created and is pending approval.', tutorPost: newTutorPost });
  } catch (error) {
    console.error('Error creating tutor post:', error);
    res.status(500).json({ error: 'Failed to create tutor post.', details: error.message });
  }
});

// Get all approved tutor posts
// router.get('/', async (req, res) => {
//   try {
//     const tutorPosts = await TutorPost.find({ status: 'approved' }).populate('parentId', 'name campusAddress');
//     res.json(tutorPosts);
//   } catch (error) {
//     console.error('Error fetching tutor posts:', error);
//     res.status(500).json({ error: 'Error fetching tutor posts.' });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const tutorPosts = await TutorPost.find({ status: 'approved' })
      .populate('parentId', 'email profilePicture')
      .exec();

    res.status(200).json(tutorPosts);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Error fetching job posts' });
  }
});

router.get('/parents/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }
    res.json(parent);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching parent data' });
  }
});

// Get tutor posts by parent with optional status filter
router.get('/parent', async (req, res) => {
  const { parentId, status } = req.query;
  try {
    if (!parentId) {
      return res.status(400).json({ error: 'ParentId is required.' });
    }
    const filter = { parentId };
    if (status) filter.status = status;

    const tutorPosts = await TutorPost.find(filter);
    res.json(tutorPosts);
  } catch (error) {
    console.error('Error fetching tutor posts by parent:', error);
    res.status(500).json({ error: 'Error fetching tutor posts.' });
  }
});

// Update tutor post status (admin)
router.put('/status/:id', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowedStatuses = ['approved', 'rejected', 'pending', 'pending_dismissal', 'dismissed'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid or missing status.' });
  }

  try {
    const updatedTutorPost = await TutorPost.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedTutorPost) {
      return res.status(404).json({ error: 'Tutor post not found.' });
    }
    res.json({ message: 'Tutor post status updated.', tutorPost: updatedTutorPost });
  } catch (error) {
    console.error('Error updating tutor post status:', error);
    res.status(500).json({ error: 'Failed to update tutor post status.' });
  }
});

// Request dismissal of tutor post by parent
router.put('/dismiss/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: 'Dismissal reason is required.' });
  }

  try {
    const tutorPost = await TutorPost.findById(id);
    if (!tutorPost) {
      return res.status(404).json({ error: 'Tutor post not found.' });
    }

    tutorPost.status = 'pending_dismissal';
    tutorPost.dismissalReason = reason;
    await tutorPost.save();

    res.json({ message: 'Dismissal request sent, waiting for admin approval.', tutorPost });
  } catch (error) {
    console.error('Error requesting dismissal:', error);
    res.status(500).json({ error: 'Failed to request dismissal.' });
  }
});

// Get all tutor posts pending dismissal (for admin)
router.get('/pending-dismissal', async (req, res) => {
  try {
    const tutorPosts = await TutorPost.find({ status: 'pending_dismissal' }).populate('parentId', 'name campusAddress');
    res.json(tutorPosts);
  } catch (error) {
    console.error('Error fetching tutor posts pending dismissal:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const pendingJobs = await TutorPost.find({ status: 'pending' });

    // Now run the population
    const populatedJobs = await TutorPost.find({ status: 'pending' })
      .populate('parentId', 'email');

    console.log('Populated Jobs:', populatedJobs); // Check if population worked
    res.json(populatedJobs);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
