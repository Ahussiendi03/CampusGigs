import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminManageTutor = () => {
  const location = useLocation();

  const [pendingTutorPosts, setPendingTutorPosts] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [errorTutors, setErrorTutors] = useState(null);
  const [showGigMenu, setShowGigMenu] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [modalAction, setModalAction] = useState(null); // "approve" or "reject"

  useEffect(() => {
    fetchPendingTutorPosts();
  }, []);

  const fetchPendingTutorPosts = async () => {
    try {
      setLoadingTutors(true);
      setErrorTutors(null);
      const response = await axios.get(
        "http://localhost:5000/api/tutorPosts/pending"
      );
      setPendingTutorPosts(response.data);
    } catch (error) {
      console.error("Error fetching pending tutor posts:", error);
      setErrorTutors("Failed to fetch pending tutor posts.");
    } finally {
      setLoadingTutors(false);
    }
  };

  // --- Handle Approve/Reject actions ---
  const confirmAction = async () => {
    if (!selectedTutorId || !modalAction) return;
    try {
      await axios.put(
        `http://localhost:5000/api/tutorPosts/status/${selectedTutorId}`,
        { status: modalAction === "approve" ? "approved" : "rejected" }
      );
      fetchPendingTutorPosts();
      closeModal();
    } catch (error) {
      console.error(`Error updating tutor post:`, error);
    }
  };

  const openModal = (tutorId, action) => {
    setSelectedTutorId(tutorId);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTutorId(null);
    setModalAction(null);
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full max-w-7xl">
          <p className="text-3xl font-bold mt-12 mb-4">Pending Tutor Posts</p>

          {loadingTutors && <p>Loading pending tutor posts...</p>}
          {errorTutors && <p className="text-red-500">{errorTutors}</p>}

          {!loadingTutors && !errorTutors && (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-yellow-300 text-black">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Parent</th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">Tutor Type</th>
                  <th className="border border-gray-300 px-4 py-2">Schedule</th>
                  <th className="border border-gray-300 px-4 py-2">Rate</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTutorPosts.map((tutor) => (
                  <tr key={tutor._id} className="bg-gray-100 hover:bg-gray-200">
                    <td className="border border-gray-300 px-4 py-2 flex items-center space-x-2">
                      {tutor.parentId?.profilePicture && (
                        <img
                          src={`http://localhost:5000/${tutor.parentId.profilePicture}`}
                          alt="Parent Profile"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span>{tutor.parentId?.email || "N/A"}</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {tutor.address}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {tutor.tutorType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {tutor.schedule}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {tutor.salary}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">
                      {tutor.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => openModal(tutor._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => openModal(tutor._id, "reject")}
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

      {/* --- Confirmation Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center">
            <h2 className="text-xl font-bold mb-4">
              {modalAction === "approve"
                ? "Approve Tutor Post?"
                : "Reject Tutor Post?"}
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span
                className={
                  modalAction === "approve"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {modalAction}
              </span>{" "}
              this tutor post?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded text-white ${
                  modalAction === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={confirmAction}
              >
                Yes, {modalAction === "approve" ? "Approve" : "Reject"}
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={closeModal}
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

export default AdminManageTutor;
