import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Tutor from '../images/tutor.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantsJobPostings = () => {
  const location = useLocation();
  const [viewType, setViewType] = useState('job');
  const [jobPosts, setJobPosts] = useState([]);
  const [tutorPosts, setTutorPosts] = useState([]);
  const [applicantId, setApplicantId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postType, setPostType] = useState('job');
  const [jobDropdownOpen, setJobDropdownOpen] = useState(true);
  const [showAccMenu, setShowAccMenu] = useState(false);
  const [showJobMenu, setShowJobMenu] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });
  const [applicationStatus, setApplicationStatus] = useState({ show: false, success: true, message: '' });


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('view') || 'job';
    setViewType(type);
  }, [location.search]);

  useEffect(() => {
    const fetchApprovedJobPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobPosts?status=approved');
        setJobPosts(res.data);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    const fetchApprovedTutorPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tutorPosts');
        setTutorPosts(res.data);
      } catch (error) {
        console.error('Error fetching tutor posts:', error);
      }
    };

    const storedApplicantId = localStorage.getItem('applicantId');
    if (storedApplicantId) setApplicantId(storedApplicantId);

    fetchApprovedJobPosts();
    fetchApprovedTutorPosts();
  }, []);

  const handleApply = async () => {
    if (!applicantId || !selectedPost) {
      setErrorModal({ show: true, message: 'Missing applicant or post' });
      return;
    }

    try {
      if (postType === 'job') {
        await axios.post('http://localhost:5000/api/applications/apply', {
          jobId: selectedPost._id,
          applicantId,
          employerId: selectedPost.employerId._id,
        });
    
        setApplicationStatus({
          show: true,
          success: true,
          message: 'Job application submitted successfully.',
        });
    
      } else {
        await axios.post('http://localhost:5000/api/tutorApplication/apply', {
          tutorPostId: selectedPost._id,
          applicantId,
          parentId: selectedPost.parentId,
        });
    
        setApplicationStatus({
          show: true,
          success: true,
          message: 'Tutor application submitted successfully.',
        });
      }
    
    } catch (err) {
      const message = err.response?.data?.error || 'You have already applied for this post.';
      setApplicationStatus({
        show: true,
        success: false,
        message,
      });
    }
    

    setShowConfirmModal(false);
  };

  const closeErrorModal = () => setErrorModal({ show: false, message: '' });

  const openConfirmModal = (post, type) => {
    setSelectedPost(post);
    setPostType(type);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedPost(null);
    setPostType('job');
  };

  const sidebarItems = [
    {
      icon: 'fa-clipboard-list',
      label: 'Job Postings',
      children: [
        {
          path: '/ApplicantsJobPostings?view=job',
          label: 'Job Post',
          icon: 'fa-briefcase',
        },
        {
          path: '/ApplicantsJobPostings?view=tutor',
          label: 'Tutor Post',
          icon: 'fa-chalkboard-teacher',
        },
      ],
    },
  ];

  return (
    <div className="flex justify-center">
      {/* ... Sidebar code remains unchanged ... */}
      <div className="bg-gray-200 w-[290px] h-auto p-4 shadow-md">
  <Link
    to="/ApplicantDashboard"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ApplicantDashboard' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  {sidebarItems.map((item, idx) => (
          <div key={idx} className="mb-2">
            {item.children ? (
              <>
                <div
                  className="flex items-center justify-between px-4 py-3 bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400"
                  onClick={() => setJobDropdownOpen(!jobDropdownOpen)}
                >
                  <div className="flex items-center font-bold text-lg">
                    <i className={`fas ${item.icon} text-lg mr-2`}></i>
                    {item.label}
                  </div>
                  <i className={`fas fa-chevron-${jobDropdownOpen ? 'up' : 'down'}`}></i>
                </div>
                {jobDropdownOpen && (
  <div className="ml-8 mt-2">
    {item.children.map((child) => (
      <Link
        key={child.path}
        to={child.path}
        className={`flex items-center mb-2 px-2 py-2 rounded hover:bg-yellow-300 ${
          location.pathname + location.search === child.path
            ? 'bg-yellow-400 font-bold text-black text-base'
            : ''
        }`}
      >
        <i className={`fas ${child.icon} text-base mr-2`}></i>
        <span className="text-base font-bold">{child.label}</span>
      </Link>
    ))}
  </div>
)}

              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  location.pathname === item.path ? 'bg-yellow-400 shadow-md text-black' : 'hover:bg-gray-300'
                }`}
              >
                <i className={`fas ${item.icon} text-lg mr-2`}></i>
                <span className="text-lg font-bold">{item.label}</span>
              </Link>
            )}
          </div>
        ))}

  {/* Dropdown: My Account */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowAccMenu(!showAccMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-user text-lg mr-2"></i>
        <span className="text-lg font-bold">My Account</span>
      </div>
      <i
        className={`fas fa-chevron-${showAccMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showAccMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ApplicantsMyAcc"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsMyAcc' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-id-badge text-base mr-2"></i>
          <span className="text-base font-bold">Profile</span>
        </Link>
        <Link
          to="/ApplicantsLevelingSystem"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsLevelingSystem' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-chart-line text-base mr-2"></i>
          <span className="text-base font-bold">Level</span>
        </Link>
      </div>
    )}
  </div>

  {/* Dropdown: Job Status */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowJobMenu(!showJobMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-briefcase text-lg mr-2"></i>
        <span className="text-lg font-bold">Job Status</span>
      </div>
      <i
        className={`fas fa-chevron-${showJobMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>
    {applicationStatus.show && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
      <div className="mb-4">
        {applicationStatus.success ? (
          <i className="fas fa-check-circle text-green-500 text-5xl"></i>
        ) : (
          <i className="fas fa-exclamation-circle text-red-500 text-5xl"></i>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">
        {applicationStatus.success ? 'Success' : 'Oops!'}
      </h2>
      <p className="text-gray-700 mb-4">{applicationStatus.message}</p>
      <button
        onClick={() => setApplicationStatus({ ...applicationStatus, show: false })}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition duration-300"
      >
        Close
      </button>
    </div>
  </div>
)}

    {showJobMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ApplicantsJobApps"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsJobApps' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-tasks text-base mr-2"></i>
          <span className="text-base font-bold">Applications</span>
        </Link>
        <Link
          to="/ApplicantsCurrentJob"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsCurrentJob' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-briefcase text-base mr-2"></i>
          <span className="text-base font-bold">Current Job</span>
        </Link>
      </div>
    )}
  </div>

  <Link
    to="/ApplicantsFeedback"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ApplicantsFeedback' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-comments text-lg mr-2"></i>
    <span className="text-lg font-bold">Feedbacks</span>
  </Link>
</div>
      <div className="flex-1 p-6 mt-2">
        <h2 className="text-3xl font-extrabold text-maroon mb-8 text-center">
          {viewType === 'job' ? 'Available Job Opportunities' : 'Available Tutor Opportunities'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {(viewType === 'job' ? jobPosts : tutorPosts).map((post) => (
            <div
              key={post._id}
              className="bg-white border border-maroon-700 shadow-md rounded-xl overflow-hidden w-full max-w-xs transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden border-b-2 border-maroon-700">
                <img
                  src={
                    viewType === 'job'
                      ? `http://localhost:5000/${post.employerId.businessImage}`
                      : Tutor
                  }
                  alt="Post"
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </div>

              <div className="p-4 text-sm space-y-2 text-gray-700">
                <h3 className="text-lg font-bold text-maroon text-center">
                  {viewType === 'job'
                    ? post.employerId.businessName
                    : post.parentBusinessName || 'Tutor Post'}
                </h3>
                {viewType === 'job' ? (
                  <>
                    <p><strong>Position:</strong> {post.position}</p>
                    <p><strong>Schedule:</strong> {post.schedule}</p>
                    <p><strong>Salary:</strong> {post.salaryRate} / {post.salaryRateType}</p>
                    <p><strong>Address:</strong> {post.address}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Type:</strong> {post.tutorType}</p>
                    <p><strong>Schedule:</strong> {post.schedule}</p>
                    <p><strong>Salary:</strong> {post.salary}</p>
                    <p><strong>Quota:</strong> {post.quota}</p>
                    <p><strong>Address:</strong> {post.address}</p>
                  </>
                )}
                <div className="text-center pt-3">
                  <button
                    onClick={() => openConfirmModal(post, viewType)}
                    className="bg-maroon-700 text-white py-2 px-6 rounded-full hover:bg-yellow-400 hover:text-maroon transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Application Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-1/3">
            <h3 className="text-xl font-bold mb-4">
              Are you sure you want to apply for this {postType === 'job' ? 'job' : 'tutor'} post?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleApply}
                className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-500 transition"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center border-2 border-red-600">
            <div className="text-red-600 text-2xl mb-3">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Application Error</h3>
            <p className="text-gray-700 mb-4">{errorModal.message}</p>
            <button
              onClick={closeErrorModal}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsJobPostings;
