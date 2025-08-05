const ApplicationModel = require('../models/Application');
const JobPostModel = require('../models/JobPost'); // Needed to verify employer

// Apply for a job
const applyForJob = async (req, res) => {
  const { jobId, applicantId } = req.body;

  try {
    const existingApplication = await ApplicationModel.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

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

// Approve application (only if employer owns the job)
const approveApplication = async (req, res) => {
  const { applicationId } = req.params;
  const employerId = req.user.employerId;

  try {
    // Fetch application and populate job info
    const application = await ApplicationModel.findById(applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Check ownership
    if (application.jobId.employerId.toString() !== employerId) {
      return res.status(403).json({ message: "You are not authorized to approve this application." });
    }

    // Check if already processed
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already processed." });
    }

    // Check if job is archived (quota full)
    if (application.jobId.status === "archived") {
      return res.status(400).json({ message: "Cannot approve application. Job quota is full and job is archived." });
    }

    // Approve the application
    application.status = "approved";
    await application.save();

    // Count approved applicants for this job
    const approvedCount = await ApplicationModel.countDocuments({
      jobId: application.jobId._id,
      status: "approved",
    });

    // If approved count >= quota, archive the job post
    if (approvedCount >= application.jobId.quota) {
      application.jobId.status = "archived";
      await application.jobId.save();
    }

    res.status(200).json({ message: "Application approved successfully", application });

  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



// Reject application (only if employer owns the job)
const rejectApplication = async (req, res) => {
  const { applicationId } = req.params;
  const employerId = req.user.employerId; // ✅ FIXED

  try {
    const application = await ApplicationModel.findById(applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Ensure the employer owns the job
    if (application.jobId.employerId.toString() !== employerId) {
      return res.status(403).json({ message: "You are not authorized to reject this application." });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already processed." });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({ message: "Application rejected successfully", application });
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
