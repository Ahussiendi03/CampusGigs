const ApplicationModel = require('../models/Application'); // Adjust the path if needed

// Function to apply for a job
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

// Function to approve an application
const approveApplication = async (req, res) => {
  const { applicantId } = req.params;

  try {
    const updatedApplication = await ApplicationModel.findOneAndUpdate(
      { applicantId, status: "pending" },
      { status: "approved" },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found or already processed." });
    }

    res.status(200).json({
      message: "Application approved successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



// Function to reject an application
const rejectApplication = async (req, res) => {
  const { applicantId } = req.params;

  try {
    const updatedApplication = await ApplicationModel.findOneAndUpdate(
      { applicantId, status: "pending" },
      { status: "rejected" },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found or already processed" });
    }

    res.status(200).json({ message: "Application rejected successfully", application: updatedApplication });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyForJob,
  approveApplication,
  rejectApplication,
};
