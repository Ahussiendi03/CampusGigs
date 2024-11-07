import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminManageJob = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  useEffect(() => {
    fetchPendingJobs();
  }, []);
  
  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobPosts/pending');
      console.log(response.data); // Check the structure of each job object here
      setPendingJobs(response.data);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      setError(error.response?.data?.message || 'Failed to fetch pending jobs.');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleAccept = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, { status: 'approved' });
      fetchPendingJobs(); // Refresh the list after accepting
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, { status: 'rejected' });
      fetchPendingJobs(); // Refresh the list after rejecting
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
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
          <Link to="/AdminAccReg" className="text-lg font-medium mr-2 ml-2">Manage Account Registrations</Link>
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
            <p className="text-3xl font-bold ml-1">Pending Job Posts</p>
            <div className="flex items-center ml-auto">
              <div className="relative mr-8">
                <input
                  type="text"
                  placeholder="Search Job"
                  className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
              </div>
            </div>
          </div>
          <h2 className="mb-4 font-bold text-base text-black bg-yellow-300 py-2 px-4 rounded w-full flex justify-between">
            <span className="mr-10">BUSINESS COMPANY</span>
            <span className="mr-11">ADDRESS</span>
            <span className="mr-11">JOB POSITION</span>
            <span className="mr-11">SCHEDULE</span>
            <span className="mr-11">RATE</span>
            <span className="mr-11">STATUS</span>
            <span className="mr-3">ACTION</span>
          </h2>

          {/* Loading and Error Handling */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Job Posts Table */}
          <div className="w-full">
            {pendingJobs.map(job => (
              <div key={job._id} className="mb-3 flex justify-between items-center bg-gray-100 py-2 px-4 rounded">
                <div className="flex items-center mr-10">
                {job.employerId?.businessImage && (
                  <img
                    src={`http://localhost:5000/${job.employerId.businessImage}`} // Adjust path if needed
                    alt="Business Logo"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                   <span>{job.employerId?.businessName || 'N/A'}</span>
                </div>

                <span className="mr-11">{job.address}</span>
                <span className="mr-11">{job.position}</span>
                <span className="mr-11">{job.schedule}</span>
                <span className="mr-11">${job.salaryRate}</span>
                <span className="mr-11">{job.status}</span>
                <div className="flex">
                  <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleAccept(job._id)}>Accept</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleReject(job._id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageJob;
