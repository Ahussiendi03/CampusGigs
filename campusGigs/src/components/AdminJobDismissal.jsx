import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminJobDismissal = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingTutorPosts, setPendingTutorPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGigMenu, setShowGigMenu] = useState(false);

  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      setLoading(true);

      // Fetch pending job posts
      const jobsResponse = await axios.get('http://localhost:5000/api/jobPosts/pending-dismissal');

      // Fetch pending tutor posts
      const tutorResponse = await axios.get('http://localhost:5000/api/tutorPosts/pending-dismissal');

      setPendingJobs(jobsResponse.data);
      setPendingTutorPosts(tutorResponse.data);
    } catch (error) {
      console.error('Error fetching pending dismissals:', error);
      setError(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissJob = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobposts/status/${jobId}`, {
        status: 'dismissed'
      });
      fetchPendingData();
    } catch (error) {
      console.error('Error marking job as dismissed:', error);
    }
  };

  const handleDismissTutorPost = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/tutorPosts/status/${postId}`, {
        status: 'dismissed'
      });
      fetchPendingData();
    } catch (error) {
      console.error('Error marking tutor post as dismissed:', error);
    }
  };

  return (
    <div className="flex">
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
      <div className="flex-1 p-6 overflow-auto max-h-[950px]">
        <h1 className="text-2xl font-bold mb-6">Job Posts Pending Dismissal</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && pendingJobs.length === 0 && pendingTutorPosts.length === 0 && (
          <p className="text-gray-500">No job or tutor posts awaiting dismissal.</p>
        )}

        {/* Job Posts */}
        {pendingJobs.length > 0 && (
          <div className="space-y-4 mb-10">
            {pendingJobs.map((job) => (
              <div key={job._id} className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
                <div className="flex items-center mb-2">
                  {job.employerId?.businessImage && (
                    <img
                      src={`http://localhost:5000/${job.employerId.businessImage}`}
                      alt="Business Logo"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{job.employerId?.businessName || 'Unknown Business'}</h2>
                    <p className="text-sm text-gray-600">{job.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-800">
                  <p><strong>Position:</strong> {job.position}</p>
                  <p><strong>Schedule:</strong> {job.schedule}</p>
                  <p><strong>Rate:</strong> {job.salaryRate}</p>
                  <p><strong>Status:</strong> {job.status}</p>
                </div>

                {job.dismissalReason && (
                  <div className="mt-3 text-sm text-gray-700">
                    <p><strong>Reason for Dismissal:</strong> {job.dismissalReason}</p>
                  </div>
                )}

                <button
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => handleDismissJob(job._id)}
                >
                  Mark as Dismissed
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tutor Posts */}
        <h1 className="text-2xl font-bold mb-6">Tutor Posts Pending Dismissal</h1>

        {pendingTutorPosts.length === 0 && !loading ? (
          <p className="text-gray-500 mb-6">No tutor posts awaiting dismissal.</p>
        ) : (
          <div className="space-y-4">
            {pendingTutorPosts.map((post) => (
              <div key={post._id} className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
                <h2 className="text-lg font-semibold">{post.tutorType}</h2>
                <p className="text-sm text-gray-600">{post.address}</p>
                <p className="text-sm text-gray-800"><strong>Schedule:</strong> {post.schedule}</p>
                <p className="text-sm text-gray-800"><strong>Salary:</strong> ${post.salary}</p>
                <p className="text-sm text-gray-800"><strong>Status:</strong> {post.status}</p>

                {post.dismissalReason && (
                  <div className="mt-3 text-sm text-gray-700">
                    <p><strong>Reason for Dismissal:</strong> {post.dismissalReason}</p>
                  </div>
                )}

                <button
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => handleDismissTutorPost(post._id)}
                >
                  Mark as Dismissed
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobDismissal;
