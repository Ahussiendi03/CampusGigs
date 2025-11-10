import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

const EmployerStaffs = () => {
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showApplicantMenu, setShowApplicantMenu] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageType, setMessageType] = useState("success"); // "success" | "error"
  const [messageText, setMessageText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const employerId = localStorage.getItem("employerId");

  useEffect(() => {
    const fetchApprovedApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/applications/approved-applicants/${employerId}`
        );
        setApprovedApplicants(response.data);
      } catch (error) {
        console.error("Error fetching approved applicants:", error);
      }
    };
    fetchApprovedApplicants();
  }, [employerId]);

  const handleGiveFeedback = (applicant) => {
    setSelectedApplicant(applicant);
    setFeedbackRating(0);
    setFeedbackComment("");
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating < 1 || feedbackRating > 5) {
      alert("Please select a rating between 1 and 5 stars");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/feedback", {
        applicationId: selectedApplicant._id,
        applicantId: selectedApplicant.applicantId._id,
        employerId,
        rating: feedbackRating,
        comments: feedbackComment,
      });

      setApprovedApplicants((prev) =>
        prev.map((app) =>
          app._id === selectedApplicant._id
            ? { ...app, feedbackGiven: true }
            : app
        )
      );

      setMessageType("success");
      setMessageText("✅ Feedback submitted successfully!");
      setShowMessageModal(true);
      setShowFeedbackModal(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessageType("error");
      setMessageText("❌ Failed to submit feedback. Please try again.");
      setShowMessageModal(true);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-star fa ${
            i <= feedbackRating ? "fas text-yellow-400" : "far text-gray-400"
          } cursor-pointer text-2xl`}
          onClick={() => setFeedbackRating(i)}
          aria-label={`${i} Star`}
          role="button"
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <EmployerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">
              My Team (Current Hired Staffs)
            </p>
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
            </div>
          </div>

          {/* Table */}
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gold text-black font-bold">
                <th className="px-4 py-3 text-left">First Name</th>
                <th className="px-4 py-3 text-left">Last Name</th>
                <th className="px-4 py-3 text-left">Job Position</th>
                <th className="px-4 py-3 text-left">Schedule</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedApplicants
                .filter((applicant) => {
                  if (!applicant.applicantId || !applicant.jobId) return false;
                  const fullName =
                    `${applicant.applicantId.firstName} ${applicant.applicantId.lastName}`.toLowerCase();
                  return fullName.includes(searchQuery.toLowerCase());
                })
                .map((applicant) => (
                  <tr key={applicant._id} className="border-b">
                    <td className="px-4 py-2">
                      {applicant.applicantId.firstName}
                    </td>
                    <td className="px-4 py-2">
                      {applicant.applicantId.lastName}
                    </td>
                    <td className="px-4 py-2">{applicant.jobId.position}</td>
                    <td className="px-4 py-2">{applicant.jobId.schedule}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          applicant.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {applicant.status === "approved"
                          ? "Active"
                          : applicant.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applicant.status === "completed" ? (
                        applicant.feedbackGiven ? (
                          <button
                            className="px-3 py-1 rounded text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition"
                            onClick={() =>
                              handleRemoveApplication(applicant._id)
                            }
                          >
                            Remove Staff
                          </button>
                        ) : (
                          <button
                            className="px-3 py-1 rounded text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() => handleGiveFeedback(applicant)}
                          >
                            Give Feedback
                          </button>
                        )
                      ) : (
                        <span className="text-gray-400 italic">
                          Waiting for completion
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal &&
          selectedApplicant &&
          selectedApplicant.applicantId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Give Feedback</h2>
                <p className="mb-4">
                  {selectedApplicant.applicantId.firstName}{" "}
                  {selectedApplicant.applicantId.lastName}
                </p>
                <div className="flex space-x-1 mb-4 justify-center">
                  {renderStars()}
                </div>
                <textarea
                  className="w-full border rounded-lg p-2 mb-4 resize-none outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  placeholder="Leave a comment (optional)"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmitFeedback}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default EmployerStaffs;
