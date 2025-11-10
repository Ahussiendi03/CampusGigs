import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminManageRegister = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [showGigMenu, setShowGigMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectUserId, setRejectUserId] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveUserId, setApproveUserId] = useState(null);

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);
  const openPreview = (src) => {
    setPreviewImage(src);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };
  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/users/pending"
      );
      setPendingRegistrations(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch pending registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/registrations/status/${approveUserId}`,
        {
          status: "approved",
        }
      );
      fetchPendingRegistrations();
      setIsApproveModalOpen(false);
      setApproveUserId(null);
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/registrations/status/${rejectUserId}`,
        {
          status: "rejected",
          reason: rejectReason,
        }
      );
      fetchPendingRegistrations();
      setIsRejectModalOpen(false);
      setRejectReason("");
      setRejectUserId(null);
    } catch (error) {
      console.error("Error rejecting registration:", error);
      alert(error.response?.data?.message || "Failed to reject user.");
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
        {/* Dashboard */}
        <Link
          to="/AdminDashboard"
          className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === "/AdminDashboard"
              ? "bg-gold shadow-md"
              : "hover:bg-gray-300"
          }`}
        >
          <i className="fas fa-home text-lg mr-2"></i>
          <span className="text-lg font-bold">Dashboard</span>
        </Link>

        {/* Manage Account Registrations */}
        <Link
          to="/AdminManageRegister"
          className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === "/AdminManageRegister"
              ? "bg-gold shadow-md"
              : "hover:bg-gray-300"
          }`}
        >
          <i className="fas fa-user text-lg mr-2"></i>
          <span className="text-lg font-bold">
            Manage Account Registrations
          </span>
        </Link>

        {/* Manage Gigs Dropdown */}
        <div className="mb-4">
          <div
            className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
            onClick={() => setShowGigMenu(!showGigMenu)}
          >
            <div className="flex items-center">
              <i className="fas fa-briefcase text-lg mr-2"></i>
              <span className="text-lg font-bold">Manage Gigs</span>
            </div>
            <i
              className={`fas fa-chevron-${
                showGigMenu ? "up" : "down"
              } text-gray-700 transition-transform duration-200`}
            ></i>
          </div>

          {showGigMenu && (
            <div className="ml-6 mt-2">
              <Link
                to="/AdminManageJob"
                className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
                  location.pathname === "/AdminManageJob"
                    ? "bg-gold shadow-md"
                    : "hover:bg-gray-300"
                }`}
              >
                <i className="fas fa-briefcase text-base mr-2"></i>
                <span className="text-base font-bold">Manage Job Posts</span>
              </Link>

              <Link
                to="/AdminManageTutor"
                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
                  location.pathname === "/AdminManageTutor"
                    ? "bg-gold shadow-md"
                    : "hover:bg-gray-300"
                }`}
              >
                <i className="fas fa-chalkboard-teacher text-base mr-2"></i>
                <span className="text-base font-bold">Manage Tutor Posts</span>
              </Link>
            </div>
          )}
          <Link
            to="/AdminJobDismissal"
            className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
              location.pathname === "/AdminJobDismissal"
                ? "bg-gold shadow-md"
                : "hover:bg-gray-300"
            }`}
          >
            <i className="fas fa-users text-lg mr-2"></i>
            <span className="text-lg font-bold">
              Manage Job Posted Dismissal
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">
          Pending Account Registrations
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-yellow-300 text-black font-bold">
              <tr>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Account Type</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRegistrations.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-100">
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4 capitalize text-yellow-500">
                    {user.status}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewProfile(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setApproveUserId(user._id);
                        setIsApproveModalOpen(true);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        setRejectUserId(user._id);
                        setIsRejectModalOpen(true);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Approve User
            </h2>
            <p className="mb-6">
              Are you sure you want to approve this account?
            </p>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
                onClick={() => {
                  setIsApproveModalOpen(false);
                  setApproveUserId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={handleApprove}
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4 text-red-600">Reject User</h2>
            <p className="mb-4">
              Please provide a reason for rejecting this account:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              rows="4"
              placeholder="Enter reason..."
            />

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason("");
                  setRejectUserId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] relative">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold">
                {selectedUser.role.charAt(0).toUpperCase() +
                  selectedUser.role.slice(1)}{" "}
                Profile
              </h2>
              <button
                className="text-xl font-bold text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            <div className="mt-4 flex">
              <div className="w-1/2 pr-4 border-r">
                <h3 className="font-semibold mb-2">Personal Info</h3>
                <p>
                  <strong>First Name:</strong> {selectedUser.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {selectedUser.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {selectedUser.contactNumber || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      selectedUser.status === "pending"
                        ? "text-yellow-500"
                        : selectedUser.status === "approved"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </p>

                {/* Role-based info */}
                {selectedUser.role === "employer" && (
                  <>
                    <h3 className="font-semibold mt-4">Business Info</h3>
                    <p>
                      <strong>Business Name:</strong>{" "}
                      {selectedUser.businessName}
                    </p>
                    <p>
                      <strong>Street Address:</strong>{" "}
                      {selectedUser.streetAddress}
                    </p>
                  </>
                )}
                {selectedUser.role === "parent" && (
                  <>
                    <h3 className="font-semibold mt-4">Address Info</h3>
                    <p>
                      <strong>House Number:</strong> {selectedUser.houseNumber}
                    </p>
                    <p>
                      <strong>Campus Address:</strong>{" "}
                      {selectedUser.campusAddress}
                    </p>
                  </>
                )}
                {selectedUser.role === "applicant" && (
                  <>
                    <h3 className="font-semibold mt-4">Address Info</h3>
                    <p>
                      <strong>Street Address:</strong>{" "}
                      {selectedUser.streetAddress}
                    </p>
                  </>
                )}
              </div>

              {/* Uploaded documents */}
              <div className="w-1/2 pl-4">
                <h3 className="font-semibold mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.profilePicture && (
                    <div>
                      <strong>Profile Picture:</strong>
                      <img
                        src={`http://localhost:5000/${selectedUser.profilePicture}`}
                        alt="Profile"
                        className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                        onClick={() =>
                          openPreview(
                            `http://localhost:5000/${selectedUser.profilePicture}`
                          )
                        }
                      />
                    </div>
                  )}

                  {selectedUser.role === "employer" && (
                    <>
                      <div>
                        <strong>Business Logo:</strong>
                        <img
                          src={`http://localhost:5000/${selectedUser.businessImage}`}
                          alt="Business"
                          className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                          onClick={() =>
                            openPreview(
                              `http://localhost:5000/${selectedUser.businessImage}`
                            )
                          }
                        />
                      </div>
                      <div>
                        <strong>Business Permit:</strong>
                        <a
                          href={`http://localhost:5000/${selectedUser.businessPermit}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline block mt-2"
                        >
                          View Document
                        </a>
                      </div>
                      <div>
                        <strong>ID:</strong>
                        <img
                          src={`http://localhost:5000/${selectedUser.id}`}
                          alt="ID"
                          className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                          onClick={() =>
                            openPreview(
                              `http://localhost:5000/${selectedUser.id}`
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  {selectedUser.role === "parent" && (
                    <>
                      <div>
                        <strong>Birth Certificate:</strong>
                        <img
                          src={`http://localhost:5000/${selectedUser.birthCertificate}`}
                          alt="Birth Certificate"
                          className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                          onClick={() =>
                            openPreview(
                              `http://localhost:5000/${selectedUser.birthCertificate}`
                            )
                          }
                        />
                      </div>
                      <div>
                        <strong>ID:</strong>
                        <img
                          src={`http://localhost:5000/${selectedUser.id}`}
                          alt="ID"
                          className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                          onClick={() =>
                            openPreview(
                              `http://localhost:5000/${selectedUser.id}`
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  {selectedUser.role === "applicant" && (
                    <>
                      <div>
                        <strong>Certificate of Registration:</strong>
                        <img
                          src={`http://localhost:5000/${selectedUser.cor}`}
                          alt="COR"
                          className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                          onClick={() =>
                            openPreview(
                              `http://localhost:5000/${selectedUser.cor}`
                            )
                          }
                        />
                      </div>
                      <div>
                        <strong>School ID:</strong>
                        <img
                          src={`http://localhost:5000/${selectedUser.schoolId}`}
                          alt="School ID"
                          className="w-32 h-32 object-cover border mt-2 cursor-pointer"
                          onClick={() =>
                            openPreview(
                              `http://localhost:5000/${selectedUser.schoolId}`
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closePreview}
        >
          <div
            className="relative bg-white p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow"
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                onClick={closePreview}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageRegister;
