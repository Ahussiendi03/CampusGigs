import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const EmployerStaffs = () => {
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const employerId = localStorage.getItem('employerId');

  useEffect(() => {
    // Fetch approved applicants when the component loads
    const fetchApprovedApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/approved-applicants/${employerId}`);
        setApprovedApplicants(response.data);
      } catch (error) {
        console.error('Error fetching approved applicants:', error);
      }
    };

    fetchApprovedApplicants();
  }, [employerId]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    
    if (confirmLogout) {
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          navigate('/sign-in');
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('An error occurred during logout:', error);
      }
    }
  };

  const handleGiveFeedback = (applicant) => {
    console.log(`Giving feedback to ${applicant.applicantId.firstName} ${applicant.applicantId.lastName}`);
    // Implement your feedback functionality here, e.g., open a modal or navigate to a feedback page
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
          <Link to="/EmployerAppList" className="text-lg font-medium mr-2 ml-2">Applicant List</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/EmployerJobPost" className="text-lg font-medium mr-2 ml-2">Post Job</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <Link to="/EmployerFeedBacks" className="text-lg font-medium ml-2">Feedbacks</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">My Team (Current Hired Staffs)</p>
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

          {/* Table Header */}
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">First Name</th>
                <th className="px-4 py-2 text-left">Last Name</th>
                <th className="px-4 py-2 text-left">Job Position</th>
                <th className="px-4 py-2 text-left">Schedule</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedApplicants
                .filter(applicant =>
                  `${applicant.applicantId.firstName} ${applicant.applicantId.lastName}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((applicant) => (
                  <tr key={applicant._id} className="border-b">
                    <td className="px-4 py-2">{applicant.applicantId.firstName}</td>
                    <td className="px-4 py-2">{applicant.applicantId.lastName}</td>
                    <td className="px-4 py-2">{applicant.jobId.position}</td>
                    <td className="px-4 py-2">{applicant.jobId.schedule}</td>
                    <td className="px-4 py-2">{applicant.status}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => handleGiveFeedback(applicant)}
                      >
                        Give Feedback
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerStaffs;
