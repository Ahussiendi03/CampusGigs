import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminManageRegister = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/pending');
      console.log(response.data); // Check the structure of the registration data
      setPendingRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
      setError(error.response?.data?.message || 'Failed to fetch pending registrations.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      await axios.put(`http://localhost:5000/api/registrations/status/${registrationId}`, { status: 'approved' });
      fetchPendingRegistrations(); // Refresh the list after approving
    } catch (error) {
      console.error('Error approving registration:', error);
    }
  };

  const handleReject = async (registrationId) => {
    try {
      await axios.put(`http://localhost:5000/api/registrations/status/${registrationId}`, { status: 'rejected' });
      fetchPendingRegistrations(); // Refresh the list after rejecting
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/AdminDashboard" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to="/adminManageRegister" className="text-lg font-medium mr-2 ml-2">Manage Account Registrations</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/AdminManageJob" className="text-lg font-medium mr-2 ml-2">Manage Job Posts</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/AdminManageTutor" className="text-lg font-medium mr-2 ml-2">Manage Tutor Posts</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <Link to="" className="text-lg font-medium ml-2">Manage Feedbacks</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Pending Account Registrations</p>
          </div>
          <h2 className="mb-4 font-bold text-base text-black bg-yellow-300 py-2 px-4 rounded w-full flex justify-between">
            <span className="mr-10">USER NAME</span>
            <span className="mr-11">EMAIL</span>
            <span className="mr-11">ROLE</span>
            <span className="mr-11">STATUS</span>
            <span className="mr-3">ACTION</span>
          </h2>

          {/* Loading and Error Handling */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Registrations Table */}
          <div className="w-full">
            {pendingRegistrations.map(registration => (
              <div key={registration._id} className="mb-3 flex justify-between items-center bg-gray-100 py-2 px-4 rounded">
                <span className="mr-10">{registration.userName}</span>
                <span className="mr-11">{registration.email}</span>
                <span className="mr-11">{registration.role}</span>
                <span className="mr-11">{registration.status}</span>
                <div className="flex">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleViewProfile(registration)}>View Profile</button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleApprove(registration._id)}>Approve</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleReject(registration._id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Viewing Profile */}
      {/* Modal for Viewing Profile */}
      {isModalOpen && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[900px]">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">
          {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)} Profile
        </h2>
        <button className="text-gray-500 hover:text-black text-lg font-semibold" onClick={closeModal}>
          &times;
        </button>
      </div>

      {/* Modal Content */}
      <div className="mt-6 flex">
        {/* Left Section: Personal Information */}
        <div className="w-1/2 pr-4 border-r">
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <p><strong>First Name:</strong> {selectedUser.firstName}</p>
          <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Contact Number:</strong> {selectedUser.contactNumber || 'N/A'}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`text-${selectedUser.status === 'pending' ? 'yellow-500' : selectedUser.status === 'approved' ? 'green-500' : 'red-500'}`}>
              {selectedUser.status}
            </span>
          </p>

          {/* Additional fields based on role */}
          {selectedUser.role === 'employer' && (
            <>
              <h3 className="text-lg font-semibold mt-4">Business Information</h3>
              <p><strong>Business Name:</strong> {selectedUser.businessName}</p>
              <p><strong>Street Address:</strong> {selectedUser.streetAddress}</p>
            </>
          )}

          {selectedUser.role === 'parent' && (
            <>
              <h3 className="text-lg font-semibold mt-4">Address Information</h3>
              <p><strong>House Number:</strong> {selectedUser.houseNumber}</p>
              <p><strong>Campus Address:</strong> {selectedUser.campusAddress}</p>
            </>
          )}

          {selectedUser.role === 'applicant' && (
            <>
              <h3 className="text-lg font-semibold mt-4">Address Information</h3>
              <p><strong>Street Address:</strong> {selectedUser.streetAddress}</p>
            </>
          )}
        </div>

        {/* Right Section: Uploaded Documents */}
        <div className="w-1/2 pl-4">
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Profile Picture:</strong>
              <img 
                src={`http://localhost:5000/${selectedUser.profilePicture}`} 
                alt="Profile" 
                className="w-32 h-32 object-cover rounded-full border mt-2" 
              />
            </div>

            {/* Employer-specific documents */}
            {selectedUser.role === 'employer' && (
              <>
                <div>
                  <strong>Business Image:</strong>
                  <img 
                    src={`http://localhost:5000/${selectedUser.businessImage}`} 
                    alt="Business" 
                    className="w-32 h-32 object-cover rounded border mt-2" 
                  />
                </div>
                <div>
      <strong>Business Permit:</strong>
      <a 
        href={`http://localhost:5000/${selectedUser.businessPermit}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 block"
      >
        View Business Permit
      </a>
    </div>
                <div>
                  <strong>ID:</strong>
                  <img 
                    src={`http://localhost:5000/${selectedUser.id}`} 
                    alt="ID" 
                    className="w-32 h-32 object-cover rounded border mt-2" 
                  />
                </div>
              </>
            )}

            {/* Parent-specific documents */}
            {selectedUser.role === 'parent' && (
              <>
                <div>
                  <strong>Birth Certificate:</strong>
                  <img 
                    src={`http://localhost:5000/${selectedUser.birthCertificate}`} 
                    alt="Birth Certificate" 
                    className="w-32 h-32 object-cover rounded border mt-2" 
                  />
                </div>
                <div>
                  <strong>ID:</strong>
                  <img 
                    src={`http://localhost:5000/${selectedUser.id}`} 
                    alt="ID" 
                    className="w-32 h-32 object-cover rounded border mt-2" 
                  />
                </div>
              </>
            )}

            {/* Applicant-specific documents */}
            {selectedUser.role === 'applicant' && (
              <>
                <div>
                  <strong>Certificate of Registration (COR):</strong>
                  <img 
                    src={`http://localhost:5000/${selectedUser.cor}`} 
                    alt="COR" 
                    className="w-32 h-32 object-cover rounded border mt-2" 
                  />
                </div>
                <div>
                  <strong>School ID:</strong>
                  <img 
                    src={`http://localhost:5000/${selectedUser.schoolId}`} 
                    alt="School ID" 
                    className="w-32 h-32 object-cover rounded border mt-2" 
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="text-right mt-4">
        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={closeModal}>
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
