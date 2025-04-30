// components/ApplicantsJobApps.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantsJobApps = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [confirmation, setConfirmation] = useState({ show: false, action: null, jobId: null });

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/applications/job-applications',
        { withCredentials: true }
      );
      console.log('Applications fetched:', response.data); // Add this log to see the data
      setAppliedJobs(response.data);
    } catch (err) {
      console.error('Error fetching job applications:', err);
    }
  };
  

  useEffect(() => {
    fetchApplications(); // Call on component mount
  }, []);

  const confirmAction = (action, jobId) => {
    setConfirmation({ show: true, action, jobId });
  };

  const handleConfirmation = (confirm) => {
    if (confirm && confirmation.action && confirmation.jobId) {
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job._id !== confirmation.jobId));
    }
    setConfirmation({ show: false, action: null, jobId: null });
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/applicantDashboard" className="text-lg font-medium mr-2 ml-2">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to="/ApplicantsMyAcc" className="text-lg font-medium mr-2 ml-2">
            My Account
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/ApplicantsJobApps" className="text-lg font-medium mr-2 ml-2">Job Applications</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/ApplicantsCurrentJob" className="text-lg font-medium mr-2 ml-2">Current Job</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fa-solid fa-chart-simple text-lg mr-2"></i>
          <Link to="/ApplicantsLevelingSystem" className="text-lg font-medium mr-2 ml-2">
            Level
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <Link to="/applicantsFeedback" className="text-lg font-medium ml-2">
            Feedbacks
          </Link>
        </div>
       
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-maroon mb-4">My Job Applications</h2>
          <p className="text-lg text-maroon-700">Track your job applications with ease!</p>
        </div>

        {/* Job Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-maroon-700 text-white">
                <th className="border border-gray-300 px-6 py-3 text-left">Business</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Position</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Status</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Rate</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Schedule</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Date Applied</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
  {appliedJobs.map((job) => (
    <tr key={job._id} className="hover:bg-gray-100">
      <td className="border border-gray-300 px-6 py-4 flex items-center">
        {/* Display the employer's business image and name */}
        <div className="flex items-center">
          {/* Display business image if available */}
          {job.employerId && job.employerId.businessImage ? (
            <img
            src={`http://localhost:5000/${job.employerId.businessImage}`}
            alt="Business Logo"
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div> // Placeholder if no image
          )}
          <span className="font-bold text-maroon">
            {job.employerId ? job.employerId.businessName : 'Unknown Business'}
          </span>
        </div>
      </td>
      <td className="border border-gray-300 px-6 py-4 text-gray-700">{job.jobId.position}</td>
      <td className="border border-gray-300 px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            job.status === 'rejected'
              ? 'bg-red-100 text-red-600'
              : job.status === 'approved'
              ? 'bg-green-100 text-green-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {job.status}
        </span>
      </td>

      <td className="border border-gray-300 px-6 py-4 text-gray-700">
        {job.jobId.salaryRate}
      </td>
      <td className="border border-gray-300 px-6 py-4 text-gray-700">{job.jobId.schedule}</td>
      <td className="border border-gray-300 px-6 py-4 text-gray-500">
        {new Date(job.applicationDate).toLocaleDateString()}
      </td>
      <td className="border border-gray-300 px-6 py-4 text-center">
        {job.status === 'pending' && (
          <button
            className="bg-gray-600 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
            onClick={() => confirmAction('cancel', job._id)}
          >
            Cancel Application
          </button>
        )}
        {job.status === 'rejected' && (
          <button
            className="bg-gray-600 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
            onClick={() => confirmAction('delete', job._id)}
          >
            Delete Application
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>



          </table>
        </div>

        {/* Confirmation Modal */}
        {confirmation.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
              <p className="mb-4">Are you sure you want to {confirmation.action} this application?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
                  onClick={() => handleConfirmation(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-800 transition"
                  onClick={() => handleConfirmation(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsJobApps;
