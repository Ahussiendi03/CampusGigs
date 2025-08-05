import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const EmployerAppList = () => {
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const employerId = localStorage.getItem('employerId');
  const [showApplicantMenu, setShowApplicantMenu] = useState(true);
  const token = Cookies.get('token') || localStorage.getItem('token');

  useEffect(() => {
    const fetchPendingApplicants = async () => {
      if (!employerId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/pending-applicants/${employerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingApplicants(response.data);
      } catch (error) {
        console.error('Error fetching pending applicants:', error);
      }
    };
    fetchPendingApplicants();
  }, [employerId, token]);

  const handleViewProfile = async (applicantId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applicant-profile/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedApplicant(response.data);
    } catch (error) {
      console.error('Error fetching applicant profile:', error.response?.data || error.message);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      const response = await axios.put(`http://localhost:5000/api/approve/${applicationId}`, {}, config);
      console.log('Application approved:', response.data);
      setPendingApplicants((prev) => prev.filter((app) => app._id !== applicationId));
      // Optionally update UI
    } catch (error) {
      console.error('Error approving application:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to approve application');
    }
  };

  const handleReject = async (applicationId) => {
    if (!applicationId) return alert('Invalid application ID');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reject/${applicationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Application rejected:', response.data);
      setPendingApplicants((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (error) {
      console.error('Error rejecting application:', error.response?.data || error.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedApplicant(null);
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
  {/* Dashboard */}
  <Link
    to="/EmployerDb"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerDb'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  {/* My Account */}
  <Link
    to="/EmployerMyAcc"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerMyAcc'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-user text-lg mr-2"></i>
    <span className="text-lg font-bold">My Account</span>
  </Link>

  {/* Applicants Dropdown */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowApplicantMenu(!showApplicantMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-users text-lg mr-2"></i>
        <span className="text-lg font-bold">Applicants</span>
      </div>
      <i
        className={`fas fa-chevron-${showApplicantMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {/* Dropdown Menu Items */}
    {showApplicantMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/EmployerStaffs"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/EmployerStaffs'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-check text-base mr-2"></i>
          <span className="text-base font-bold">Current Hired Staffs</span>
        </Link>

        <Link
          to="/EmployerAppList"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/EmployerAppList'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-clock text-base mr-2"></i>
          <span className="text-base font-bold">Applicant List</span>
        </Link>
      </div>
    )}
  </div>

  {/* Post Job */}
  <Link
    to="/EmployerJobPost"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerJobPost'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-briefcase text-lg mr-2"></i>
    <span className="text-lg font-bold">Post Job</span>
  </Link>

  {/* Feedbacks */}
  <Link
    to="/EmployerFeedbacks"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerFeedbacks'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-comments text-lg mr-2"></i>
    <span className="text-lg font-bold">Feedbacks</span>
  </Link>
</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-10 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Applicants List</p>
          </div>

          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-yellow-300">
              <tr>
                <th className="px-4 py-2 text-left">FIRST NAME</th>
                <th className="px-4 py-2 text-left">LAST NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">JOB APPLIED</th>
                <th className="px-4 py-2 text-left">VIEW PROFILE</th>
                <th className="px-4 py-2 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplicants
                .filter((applicant) => applicant.status !== 'rejected')
                .map((applicant) => (
                  <tr key={applicant._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{applicant.applicantId?.firstName || 'N/A'}</td>
                    <td className="border px-4 py-2">{applicant.applicantId?.lastName || 'N/A'}</td>
                    <td className="border px-4 py-2">{applicant.applicantId?.email || 'N/A'}</td>
                    <td className="border px-4 py-2">
                      {applicant.jobId ? (
                        <>
                          <p><strong>Position:</strong> {applicant.jobId.position}</p>
                          <p><strong>Schedule:</strong> {applicant.jobId.schedule}</p>
                          <p><strong>Job Salary:</strong> {applicant.jobId.salaryRate}/{applicant.jobId.salaryRateType === 'per day' ? 'day' : 'hour'}</p>
                        </>
                      ) : (
                        <p>N/A</p>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        className="text-blue-500 font-semibold"
                        onClick={() => handleViewProfile(applicant.applicantId?._id)}
                      >
                        View Profile
                      </button>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        className="text-green-500 font-semibold mr-2"
                        onClick={() => handleApprove(applicant._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="text-red-500 font-semibold"
                        onClick={() => handleReject(applicant._id)}
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

      {/* Profile Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[700px] h-[500px] relative flex">
            <div className="w-1/2 flex flex-col items-center pr-4 border-r border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Applicant Profile</h2>
              {selectedApplicant.profilePicture ? (
                <img
                  src={`http://localhost:5000/${selectedApplicant.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-yellow-400 shadow-md mb-4"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xl mb-4">
                  No Image
                </div>
              )}
              <div className="text-left space-y-2 w-full px-6">
                <p className="text-gray-700"><strong>First Name:</strong> <span className="font-medium">{selectedApplicant.firstName || 'N/A'}</span></p>
                <p className="text-gray-700"><strong>Last Name:</strong> <span className="font-medium">{selectedApplicant.lastName || 'N/A'}</span></p>
                <p className="text-gray-700"><strong>Email:</strong> <span className="font-medium">{selectedApplicant.email || 'N/A'}</span></p>
                <p className="text-gray-700"><strong>Street Address:</strong> <span className="font-medium">{selectedApplicant.streetAddress || 'N/A'}</span></p>
              </div>
            </div>
            <div className="w-1/2 pl-4 flex flex-col items-center justify-between space-y-6">
              <div className="text-gray-700 text-center">
                <p className="font-bold mb-1">Certificate of Registration (COR):</p>
                {selectedApplicant.cor ? (
                  <img
                    src={`http://localhost:5000/${selectedApplicant.cor}`}
                    alt="COR"
                    className="w-48 h-36 object-cover rounded-lg shadow-md border"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No COR Available</p>
                )}
              </div>
              <div className="text-gray-700 text-center">
                <p className="font-bold mb-1">School ID:</p>
                {selectedApplicant.schoolId ? (
                  <img
                    src={`http://localhost:5000/${selectedApplicant.schoolId}`}
                    alt="School ID"
                    className="w-48 h-36 object-cover rounded-lg shadow-md border"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No School ID Available</p>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded shadow-md"
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

export default EmployerAppList;
