const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent'); // Adjust the path to your model
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT & get user ID

// GET parent profile data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const parent = await Parent.findById(req.user.parentId);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update parent profile data
router.put('/me', authMiddleware, async (req, res) => {
  const { firstName, lastName, contactNumber, campusAddress, houseNumber } = req.body;

  try {
    const parent = await Parent.findById(req.user.parentId);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Update fields only if provided
    if (firstName !== undefined) parent.firstName = firstName;
    if (lastName !== undefined) parent.lastName = lastName;
    if (contactNumber !== undefined) parent.contactNumber = contactNumber;
    if (campusAddress !== undefined) parent.campusAddress = campusAddress;
    if (houseNumber !== undefined) parent.houseNumber = houseNumber;

    // Save updated parent
    await parent.save();

    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const parent = await ParentModel.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(parent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
