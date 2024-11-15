// controllers/applicationController.js

const ApplicationModel = require('../models/Application'); // Adjust the path if needed

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

module.exports = { applyForJob };
