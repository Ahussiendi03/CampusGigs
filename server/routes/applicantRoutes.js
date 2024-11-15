const express = require('express');
const { getApplicantProfile } = require('../controllers/applicantController'); // Import the controller
const router = express.Router();

// Define route for getting an applicant's profile
router.get('/applicant-profile/:applicantId', getApplicantProfile);

module.exports = router;
