import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminManageJob = () => {
  const location = useLocation();

  const [pendingJobs, setPendingJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);
  const [showGigMenu, setShowGigMenu] = useState(true);

  // Modal states
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoadingJobs(true);
      setErrorJobs(null);
      const response = await axios.get(
        "http://localhost:5000/api/jobPosts/pending"
      );
      setPendingJobs(response.data);
    } catch (error) {
      console.error("Error fetching pending jobs:", error);
      setErrorJobs(
        error.response?.data?.message || "Failed to fetch pending jobs."
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleAccept = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, {
        status: "approved",
      });
      fetchPendingJobs();
      setConfirmApproveId(null);
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, {
        status: "rejected",
      });
      fetchPendingJobs();
      setConfirmRejectId(null);
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full max-w-7xl">
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Pending Job Posts</p>
          </div>

          {/* Pending Jobs Table */}
          {loadingJobs && <p>Loading pending jobs...</p>}
          {errorJobs && <p className="text-red-500">{errorJobs}</p>}
          {!loadingJobs && !errorJobs && (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-yellow-300 text-black">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Business Company
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Job Position
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Schedule</th>
                  <th className="border border-gray-300 px-4 py-2">Rate</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingJobs.map((job) => (
                  <tr key={job._id} className="bg-gray-100 hover:bg-gray-200">
                    <td className="border border-gray-300 px-4 py-2 flex items-center space-x-2">
                      {job.employerId?.businessImage && (
                        <img
                          src={`http://localhost:5000/${job.employerId.businessImage}`}
                          alt="Business Logo"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span>{job.employerId?.businessName || "N/A"}</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.address}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.position}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {job.schedule}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {job.salaryRate}/
                      {job.salaryRateType === "per day" ? "day" : "hour"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">
                      {job.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => setConfirmApproveId(job._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => setConfirmRejectId(job._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {confirmApproveId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-center">
              Approve Job Post
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to{" "}
              <span className="font-semibold text-green-600">approve</span> this
              job post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAccept(confirmApproveId)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm Approved
              </button>
              <button
                onClick={() => setConfirmApproveId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {confirmRejectId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-center">
              Reject Job Post
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to{" "}
              <span className="font-semibold text-red-600">reject</span> this
              job post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleReject(confirmRejectId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setConfirmRejectId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageJob;
``;
