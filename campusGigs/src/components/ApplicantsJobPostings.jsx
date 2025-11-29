import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ApplicantSidebar from "./ApplicantSidebar";
import Tutor from "../images/tutor.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplicantsJobPostings = () => {
  const location = useLocation();
  const [viewType, setViewType] = useState("job");
  const [jobPosts, setJobPosts] = useState([]);
  const [tutorPosts, setTutorPosts] = useState([]);
  const [applicantId, setApplicantId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postType, setPostType] = useState("job");
  const [jobDropdownOpen, setJobDropdownOpen] = useState(true);
  const [showAccMenu, setShowAccMenu] = useState(false);
  const [showJobMenu, setShowJobMenu] = useState(false);
  const [applicationLetter, setApplicationLetter] = useState(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [applicationStatus, setApplicationStatus] = useState({
    show: false,
    success: true,
    message: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("view") || "job";
    setViewType(type);
  }, [location.search]);

  useEffect(() => {
    const fetchApprovedJobPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/jobPosts?status=approved"
        );
        // Sort by newest approved first (based on updatedAt)
        const sortedJobs = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setJobPosts(sortedJobs);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };
  
    const fetchApprovedTutorPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tutorPosts");
        // Sort by newest created first
        const sortedTutors = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTutorPosts(sortedTutors);
      } catch (error) {
        console.error("Error fetching tutor posts:", error);
      }
    };
  
    const storedApplicantId = localStorage.getItem("applicantId");
    if (storedApplicantId) setApplicantId(storedApplicantId);
  
    fetchApprovedJobPosts();
    fetchApprovedTutorPosts();
  }, []);
  
  
  const handleApply = async () => {
    if (!applicantId || !selectedPost || !applicationLetter) {
      setErrorModal({ show: true, message: "Missing applicant, post, or application letter" });
      return;
    }
  
    try {
      const formData = new FormData();
  
      if (postType === "job") {
        formData.append("jobId", selectedPost._id);
        formData.append("applicantId", applicantId);
        formData.append("employerId", selectedPost.employerId._id);
      } else {
        formData.append("tutorPostId", selectedPost._id);
        formData.append("applicantId", applicantId);
        formData.append("parentId", selectedPost.parentId);
      }
  
      formData.append("applicationLetter", applicationLetter); // upload file
  
      const url =
        postType === "job"
          ? "http://localhost:5000/api/applications/apply"
          : "http://localhost:5000/api/tutorApplication/apply";
  
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setApplicationStatus({
        show: true,
        success: true,
        message:
          postType === "job"
            ? "Job application submitted successfully."
            : "Tutor application submitted successfully.",
      });
    } catch (err) {
      const message =
        err.response?.data?.error || "You have already applied for this post.";
      setApplicationStatus({
        show: true,
        success: false,
        message,
      });
    }
  
    setShowConfirmModal(false);
  };
  

  // const handleApply = async () => {
  //   if (!applicantId || !selectedPost) {
  //     setErrorModal({ show: true, message: "Missing applicant or post" });
  //     return;
  //   }

  //   try {
  //     if (postType === "job") {
  //       await axios.post("http://localhost:5000/api/applications/apply", {
  //         jobId: selectedPost._id,
  //         applicantId,
  //         employerId: selectedPost.employerId._id,
  //       });

  //       setApplicationStatus({
  //         show: true,
  //         success: true,
  //         message: "Job application submitted successfully.",
  //       });
  //     } else {
  //       await axios.post("http://localhost:5000/api/tutorApplication/apply", {
  //         tutorPostId: selectedPost._id,
  //         applicantId,
  //         parentId: selectedPost.parentId,
  //       });

  //       setApplicationStatus({
  //         show: true,
  //         success: true,
  //         message: "Tutor application submitted successfully.",
  //       });
  //     }
  //   } catch (err) {
  //     const message =
  //       err.response?.data?.error || "You have already applied for this post.";
  //     setApplicationStatus({
  //       show: true,
  //       success: false,
  //       message,
  //     });
  //   }

  //   setShowConfirmModal(false);
  // };

  const closeErrorModal = () => setErrorModal({ show: false, message: "" });

  const openConfirmModal = (post, type) => {
    setSelectedPost(post);
    setPostType(type);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedPost(null);
    setPostType("job");
  };

  return (
    <div className="flex justify-center">
      {/* ... Sidebar code remains unchanged ... */}
      <ApplicantSidebar />
      <div className="flex-1 p-6 mt-2">
        <h2 className="text-3xl font-extrabold text-maroon mb-8 text-center">
          {viewType === "job"
            ? "Available Job Opportunities"
            : "Available Tutor Opportunities"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {(viewType === "job" ? jobPosts : tutorPosts).map((post) => (
            <div
              key={post._id}
              className="bg-white border border-maroon-700 shadow-md rounded-xl overflow-hidden w-full max-w-xs transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden border-b-2 border-maroon-700">
                <img
                  src={
                    viewType === "job"
                      ? `http://localhost:5000/${post.employerId.businessImage}`
                      : Tutor
                  }
                  alt="Post"
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </div>

              <div className="p-4 text-sm space-y-2 text-gray-700">
                <h3 className="text-lg font-bold text-maroon text-center">
                  {viewType === "job"
                    ? post.employerId.businessName
                    : post.parentBusinessName || "Tutor Post"}
                </h3>
                {viewType === "job" ? (
                  <>
                    <p>
                      <strong>Position:</strong> {post.position}
                    </p>
                    <p>
                      <strong>Schedule:</strong> {post.schedule}
                    </p>
                    <p>
                      <strong>Salary:</strong> {post.salaryRate} /{" "}
                      {post.salaryRateType}
                    </p>
                    <p>
                      <strong>Address:</strong> {post.address}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Type:</strong> {post.tutorType}
                    </p>
                    <p>
                      <strong>Schedule:</strong> {post.schedule}
                    </p>
                    <p>
                      <strong>Salary:</strong> {post.salary}
                    </p>
                    <p>
                      <strong>Quota:</strong> {post.quota}
                    </p>
                    <p>
                      <strong>Address:</strong> {post.address}
                    </p>
                  </>
                )}
                <div className="text-center pt-3">
                  <button
                    onClick={() => openConfirmModal(post, viewType)}
                    className="bg-maroon-700 text-white py-2 px-6 rounded-full hover:bg-yellow-400 hover:text-maroon transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Application Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-1/3">
            <h3 className="text-xl font-bold mb-4">
              Upload your application letter to apply for this{" "}
              {postType === "job" ? "job" : "tutor"} post.
            </h3>

            {/* Upload field */}
            <div className="mb-4 text-left">
              <label className="font-semibold text-gray-700 block mb-1">
                Application Letter (PDF or Doc)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplicationLetter(e.target.files[0])}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleApply}
                className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-500 transition"
              >
                Submit
              </button>

              <button
                onClick={closeConfirmModal}
                className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center border-2 border-red-600">
            <div className="text-red-600 text-2xl mb-3">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Application Error</h3>
            <p className="text-gray-700 mb-4">{errorModal.message}</p>
            <button
              onClick={closeErrorModal}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsJobPostings;
