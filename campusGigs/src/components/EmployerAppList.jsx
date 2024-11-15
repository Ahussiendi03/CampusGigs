import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const EmployerAppList = () => {
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const navigate = useNavigate();
  const employerId = localStorage.getItem('employerId');

  useEffect(() => {
    const fetchPendingApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/pending-applicants/${employerId}`);
        setPendingApplicants(response.data);
      } catch (error) {
        console.error('Error fetching pending applicants:', error);
      }
    };

    fetchPendingApplicants();
  }, [employerId]);

  const handleViewProfile = async (applicantId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applicant-profile/${applicantId}`);
      console.log('Applicant profile data:', response.data); // Log the response to check the data
      setSelectedApplicant(response.data);
    } catch (error) {
      console.error('Error fetching applicant profile:', error);
    }
  };
  

  const handleApprove = (applicantId) => {
    // Add approve logic here
    console.log(`Applicant with ID ${applicantId} approved`);
  };

  const handleCloseModal = () => {
    setSelectedApplicant(null);
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[340px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/EmployerDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to="/EmployerMyAcc" className="text-lg font-medium mr-2 ml-2">My Account</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to="/EmployerStaffs" className="text-lg font-medium mr-2 ml-2">Current Hired Staffs</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Applicant List</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/EmployerJobPost" className="text-lg font-medium mr-2 ml-2">Post Job</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <p className="text-lg font-medium ml-2">Feedbacks</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-10 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-xl font-bold">Applicants List</p>
          </div>

          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-yellow-300">
              <tr>
                <th className="px-4 py-2 text-left">FIRST NAME</th>
                <th className="px-4 py-2 text-left">LAST NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">VIEW PROFILE</th>
                <th className="px-4 py-2 text-left">APPROVE</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplicants.map((applicant) => (
                <tr key={applicant._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{applicant.applicantId.firstName}</td>
                  <td className="border px-4 py-2">{applicant.applicantId.lastName}</td>
                  <td className="border px-4 py-2">{applicant.applicantId.email}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-blue-500 font-semibold"
                      onClick={() => handleViewProfile(applicant.applicantId._id)}
                    >
                      View Profile
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="text-green-500 font-semibold"
                      onClick={() => handleApprove(applicant.applicantId._id)}
                    >
                      Approve
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
      {/* Left Section: Profile Picture and Basic Details */}
      <div className="w-1/2 flex flex-col items-center pr-4 border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Applicant Profile</h2>
        
        {/* Profile Picture */}
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

        {/* Basic Information */}
        <div className="text-left space-y-2 w-full px-6">
          <p className="text-gray-700"><strong>First Name:</strong> <span className="font-medium">{selectedApplicant.firstName || 'N/A'}</span></p>
          <p className="text-gray-700"><strong>Last Name:</strong> <span className="font-medium">{selectedApplicant.lastName || 'N/A'}</span></p>
          <p className="text-gray-700"><strong>Email:</strong> <span className="font-medium">{selectedApplicant.email || 'N/A'}</span></p>
          <p className="text-gray-700"><strong>Street Address:</strong> <span className="font-medium">{selectedApplicant.streetAddress || 'N/A'}</span></p>
          
        </div>
      </div>

      {/* Right Section: Documents */}
      <div className="w-1/2 pl-4 flex flex-col items-center justify-between space-y-6">
        {/* Certificate of Registration (COR) */}
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

        {/* School ID */}
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

        {/* Close Button */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}





    </div>
  );
};

export default EmployerAppList;
