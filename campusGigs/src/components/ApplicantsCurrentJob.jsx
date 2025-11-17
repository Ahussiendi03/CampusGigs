import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ApplicantSidebar from "./ApplicantSidebar";
import Tutor from "../images/tutor.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplicantsCurrentJob = () => {
  const location = useLocation();
  const [currentJobs, setCurrentJobs] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showAccMenu, setShowAccMenu] = useState(false);
  const [showJobMenu, setShowJobMenu] = useState(true);
  const [feedbackStatus, setFeedbackStatus] = useState({
    show: false,
    success: true,
    message: "",
  });

  useEffect(() => {
    const fetchCurrentJobs = async () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        if (!token) return console.error("No token found");

        const decoded = jwtDecode(token);
        const applicantId =
          decoded.applicantId || decoded.userId || decoded.id || decoded.email;
        if (!applicantId) return console.error("Applicant ID is undefined");

        const [jobRes, tutorRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/applications/approved/${applicantId}`
          ),
          axios.get(
            `http://localhost:5000/api/tutorApplication/approved/${applicantId}`
          ),
        ]);

        const formattedJobApps = jobRes.data.map((app) => ({
          ...app,
          type: "job",
          jobId: app.jobId, // keep jobId object for postId use
          employerId: app.employerId,
          position: app.jobId?.position,
          salaryRate: app.jobId?.salaryRate,
          schedule: app.jobId?.schedule,
          applicationDate: app.applicationDate,
          image: app.employerId?.businessImage,
          name: app.employerId?.businessName,
        }));

        const formattedTutorApps = tutorRes.data.map((app) => ({
          ...app,
          type: "tutor",
          tutorPostId: app.tutorPostId, // keep tutorPostId object for postId use
          parentId: app.parentId,
          position: app.tutorPostId?.tutorType,
          salaryRate: app.tutorPostId?.salary,
          schedule: app.tutorPostId?.schedule,
          applicationDate: app.applicationDate,
          image: Tutor,
          name: "Tutor",
        }));

        setCurrentJobs([...formattedJobApps, ...formattedTutorApps]);
      } catch (error) {
        console.error("Failed to fetch current jobs or tutors: ", error);
      }
    };

    fetchCurrentJobs();
  }, []);

  const isInRatingPeriod = () => {
    const now = new Date();
    const month = now.getMonth();
    const date = now.getDate();
    return (month === 4 && date >= 25) || (month === 7 && date >= 10); // May or Dec
  };

  const allowRating = isInRatingPeriod();

  const openRatingModal = (job) => {
    setSelectedJob(job);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedJob(null);
    setRating(null);
    setFeedback("");
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    try {
      // Get token from cookies or localStorage
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) {
        setFeedbackStatus({
          show: true,
          success: false,
          message: "User not authenticated.",
        });
        return;
      }

      const decoded = jwtDecode(token);
      const applicantId =
        decoded.applicantId || decoded.userId || decoded.id || decoded.email;

      const payload = {
        applicantId,
        receiverId:
          selectedJob.type === "job"
            ? selectedJob.employerId?._id
            : selectedJob.parentId?._id,
        receiverModel: selectedJob.type === "job" ? "employer" : "parent",
        rating,
        comments: feedback,
        postId:
          selectedJob.type === "job"
            ? selectedJob.jobId?._id
            : selectedJob.tutorPostId?._id,
      };

      await axios.post(
        "http://localhost:5000/api/applicant-feedback",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setFeedbackStatus({
        show: true,
        success: true,
        message: "Thank you for your feedback!",
      });

      closeRatingModal();
    } catch (error) {
      console.error(
        "Error submitting feedback:",
        error.response?.data || error.message
      );
      setFeedbackStatus({
        show: true,
        success: false,
        message: "Failed to submit feedback. Please try again.",
      });
    }
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
            My Current Jobs
          </h2>
          <p className="text-lg text-maroon-700">
            View your active and completed part-time jobs!
          </p>
        </div>

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
              {currentJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-6 py-4 flex items-center">
                    {job.image ? (
                      <img
                        src={
                          job.type === "tutor"
                            ? job.image
                            : `http://localhost:5000/${job.image}`
                        }
                        alt="Logo"
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                    )}
                    <span className="font-bold text-maroon">
                      {job.name || "Unknown"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.position}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        job.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {job.status === "approved" ? "Active" : job.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.salaryRate}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.schedule}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-500">
                    {new Date(job.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    <button
                      className={`px-4 py-2 rounded-full transition ${
                        allowRating
                          ? "bg-maroon-700 text-white hover:bg-gold hover:text-maroon cursor-pointer"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      onClick={() => openRatingModal(job)}
                      disabled={!allowRating}
                      title={
                        !allowRating
                          ? "Rating available during the last week of May and December."
                          : ""
                      }
                    >
                      Rate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isRatingModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4 text-center">
                Rate {selectedJob.position}
              </h3>
              <form onSubmit={handleSubmitFeedback}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Rating:
                  </label>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`text-2xl ${
                          rating >= star ? "text-yellow-500" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Feedback:
                  </label>
                  <textarea
                    className="w-full border border-gray-300 p-2 rounded"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
                    onClick={closeRatingModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-maroon-700 text-white px-4 py-2 rounded hover:bg-gold hover:text-maroon"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsCurrentJob;
