const ApplicantModel = require('../models/Applicant');

// Controller to get applicant's full profile
const getApplicantProfile = async (req, res) => {
  const { applicantId } = req.params;

  try {
    // Find the applicant by ID and populate fields if necessary
    const applicant = await ApplicantModel.findById(applicantId);
    
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Respond with the applicant's full data
    res.status(200).json(applicant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const applyForJob = async (req, res) => {
  const { jobId, applicantId } = req.body;

  try {
    // Check if the applicant has already applied for this job
    const existingApplication = await ApplicationModel.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Create a new application
    const newApplication = new ApplicationModel({
      jobId,
      applicantId,
      status: "pending",
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getApplicantProfile };
