import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminManageJob = () => {
  const location = useLocation();

  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingTutorPosts, setPendingTutorPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);
  const [errorTutors, setErrorTutors] = useState(null);
  const [showGigMenu, setShowGigMenu] = useState(true);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoadingJobs(true);
      setErrorJobs(null);
      const response = await axios.get('http://localhost:5000/api/jobPosts/pending');
      setPendingJobs(response.data);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      setErrorJobs(error.response?.data?.message || 'Failed to fetch pending jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };

  

  const handleAccept = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, { status: 'approved' });
      fetchPendingJobs();
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, { status: 'rejected' });
      fetchPendingJobs();
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const handleAcceptTutor = async (tutorId) => {
    try {
      await axios.put(`http://localhost:5000/api/tutorPosts/status/${tutorId}`, { status: 'approved' });
      fetchPendingTutorPosts();
    } catch (error) {
      console.error('Error accepting tutor post:', error);
    }
  };

  const handleRejectTutor = async (tutorId) => {
    try {
      await axios.put(`http://localhost:5000/api/tutorPosts/status/${tutorId}`, { status: 'rejected' });
      fetchPendingTutorPosts();
    } catch (error) {
      console.error('Error rejecting tutor post:', error);
    }
  };

  const sidebarLinks = [
    { to: '/AdminDashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { to: '/AdminManageRegister', icon: 'fas fa-user', label: 'Manage Account Registrations' },
    { to: '/AdminManageJob', icon: 'fas fa-users', label: 'Manage Job Posts' },
    { to: '/AdminJobDismissal', icon: 'fas fa-users', label: 'Manage Job Posted Dismissal' },
  ];

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
  {/* Dashboard */}
  <Link
    to="/AdminDashboard"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/AdminDashboard'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  {/* Manage Account Registrations */}
  <Link
    to="/AdminManageRegister"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/AdminManageRegister'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-user text-lg mr-2"></i>
    <span className="text-lg font-bold">Manage Account Registrations</span>
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
        className={`fas fa-chevron-${showGigMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showGigMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/AdminManageJob"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/AdminManageJob'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-briefcase text-base mr-2"></i>
          <span className="text-base font-bold">Manage Job Posts</span>
        </Link>

        <Link
          to="/AdminManageTutor"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/AdminManageTutor'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
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
            location.pathname === '/AdminJobDismissal' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-users text-lg mr-2"></i>
          <span className="text-lg font-bold">Manage Job Posted Dismissal</span>
        </Link>
  </div>
</div>


      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full max-w-7xl">
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Pending Job Posts</p>
            {/* <div className="flex items-center ml-auto">
              <div className="relative mr-8">
                <input
                  type="text"
                  placeholder="Search Job"
                  className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
              </div>
            </div> */}
          </div>

          {/* Pending Jobs Table */}
          {loadingJobs && <p>Loading pending jobs...</p>}
          {errorJobs && <p className="text-red-500">{errorJobs}</p>}
          {!loadingJobs && !errorJobs && (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-yellow-300 text-black">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Business Company</th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">Job Position</th>
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
                      <span>{job.employerId?.businessName || 'N/A'}</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{job.address}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.position}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.schedule}</td>
                    <td className="py-2 px-4 border-b">
                      {job.salaryRate}/{job.salaryRateType === 'per day' ? 'day' : 'hour'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{job.status}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleAccept(job._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleReject(job._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Tutor Posts Section */}
        </div>
      </div>
    </div>
  );
};

export default AdminManageJob;
