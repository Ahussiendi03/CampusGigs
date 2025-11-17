// components/ApplicantsJobApps.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ApplicantSidebar from "./ApplicantSidebar";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplicantsJobApps = () => {
  const location = useLocation();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [confirmation, setConfirmation] = useState({
    show: false,
    action: null,
    jobId: null,
  });
  const [showAccMenu, setShowAccMenu] = useState(false);
  const [showJobMenu, setShowJobMenu] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/applications/job-applications",
        { withCredentials: true }
      );
      console.log("Applications fetched:", response.data);
      setAppliedJobs(response.data);
    } catch (err) {
      console.error("Error fetching job applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ✅ Cancel application (for pending)
  const cancelApplication = async (jobId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/applications/cancel/${jobId}`,
        {
          withCredentials: true,
        }
      );
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      console.log("Application cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel application:", error);
    }
  };

  // ❌ Delete application (for rejected)
  const deleteApplication = async (jobId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/applications/delete/${jobId}`,
        {
          withCredentials: true,
        }
      );
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      console.log("Application deleted successfully");
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const confirmAction = (action, jobId) => {
    setConfirmation({ show: true, action, jobId });
  };

  const handleConfirmation = async (confirm) => {
    if (confirm && confirmation.action && confirmation.jobId) {
      if (confirmation.action === "cancel") {
        await cancelApplication(confirmation.jobId);
      } else if (confirmation.action === "delete") {
        await deleteApplication(confirmation.jobId);
      }
    }
    setConfirmation({ show: false, action: null, jobId: null });
  };

  const sidebarItems = [
    { path: "/ApplicantDashboard", icon: "fa-home", label: "Dashboard" },
    {
      path: "/ApplicantsJobPostings",
      icon: "fa-clipboard-list",
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Job Postings</span>
          <i className="fas fa-chevron-down text-base ml-20 text-gray-600"></i>
        </div>
      ),
    },

    { path: "/ApplicantsMyAcc", icon: "fa-user", label: "My Account" },
    { path: "/ApplicantsJobApps", icon: "fa-users", label: "Job Applications" },
    { path: "/ApplicantsCurrentJob", icon: "fa-users", label: "Current Job" },
    { path: "/ApplicantsLevelingSystem", icon: "fa-briefcase", label: "Level" },
    { path: "/ApplicantsFeedback", icon: "fa-comments", label: "Feedbacks" },
  ];

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <ApplicantSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-maroon mb-4">
            My Job Applications
          </h2>
          <p className="text-lg text-maroon-700">
            Track your job applications with ease!
          </p>
        </div>

        {/* Job Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-maroon-700 text-white">
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Business
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Position
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Status
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Rate
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Schedule
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Date Applied
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appliedJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-6 py-4 flex items-center">
                    <div className="flex items-center">
                      {job.employerId?.businessImage ? (
                        <img
                          src={`http://localhost:5000/${job.employerId.businessImage}`}
                          alt="Business Logo"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                      )}
                      <span className="font-bold text-maroon">
                        {job.employerId?.businessName || "Unknown Business"}
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.jobId?.position || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        job.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : job.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.jobId?.salaryRate || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.jobId?.schedule || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-500">
                    {job.applicationDate
                      ? new Date(job.applicationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    {job.status === "pending" && (
                      <button
                        className="bg-gray-600 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
                        onClick={() => confirmAction("cancel", job._id)}
                      >
                        Cancel Application
                      </button>
                    )}
                    {job.status === "rejected" && (
                      <button
                        className="bg-gray-600 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
                        onClick={() => confirmAction("delete", job._id)}
                      >
                        Delete Application
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        {confirmation.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
              <p className="mb-4">
                Are you sure you want to {confirmation.action} this application?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
                  onClick={() => handleConfirmation(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-800 transition"
                  onClick={() => handleConfirmation(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsJobApps;
