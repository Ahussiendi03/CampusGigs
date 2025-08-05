import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantsFeedBack = () => {
  const location = useLocation();
  const [employerFeedbacks, setEmployerFeedbacks] = useState([]);
  const [parentFeedbacks, setParentFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [showAccMenu, setShowAccMenu] = useState(false);
const [showJobMenu, setShowJobMenu] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to login first.');
        return;
      }

      const res = await axios.get('http://localhost:5000/api/feedback/me', {
        withCredentials: true,
      });

      console.log('feedbacks:', res.data);
      setEmployerFeedbacks(res.data.employerFeedbacks || []);
      setParentFeedbacks(res.data.parentFeedbacks || []);
    } catch (err) {
      setError('Failed to fetch feedbacks.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star text-yellow-500"></i>);
    }
    if (halfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500"></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>);
    }
    return stars;
  };

  const sidebarItems = [
    { path: '/ApplicantDashboard', icon: 'fa-home', label: 'Dashboard' },
    {
      path: '/ApplicantsJobPostings',
      icon: 'fa-clipboard-list',
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Job Postings</span>
          <i className="fas fa-chevron-down text-base ml-20 text-gray-600"></i>
        </div>
      ),
    },
    { path: '/ApplicantsMyAcc', icon: 'fa-user', label: 'My Account' },
    { path: '/ApplicantsJobApps', icon: 'fa-users', label: 'Job Applications' },
    { path: '/ApplicantsCurrentJob', icon: 'fa-users', label: 'Current Job' },
    { path: '/ApplicantsLevelingSystem', icon: 'fa-briefcase', label: 'Level' },
    { path: '/ApplicantsFeedback', icon: 'fa-comments', label: 'Feedbacks' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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

  <Link
    to="/ApplicantsJobPostings"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ApplicantsJobPostings' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-clipboard-list text-lg mr-2"></i>
    <span className="text-lg font-bold">Job Postings</span>
    <i className='fas fa-chevron-down text-base ml-20 text-gray-600'></i>
  </Link>

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

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 shadow-md rounded-lg mt-1 overflow-y-auto max-h-[950px]">
        {/* Employer Feedbacks Section */}
        <h2 className="text-3xl font-bold mb-6">Employer Feedbacks</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4 mb-12">
          {employerFeedbacks.length === 0 && !error && <p>No employer feedbacks available.</p>}

          {employerFeedbacks.map((fb) => (
            <div key={fb._id} className="border-b pb-4">
              <div className="flex items-center space-x-3 mb-1">
                {fb.employerId?.businessImage && (
                  <img
                    src={`http://localhost:5000/${fb.employerId.businessImage}`}
                    alt={`${fb.employerId.businessName} logo`}
                    className="w-10 h-10 object-cover rounded-full border border-black p-1"
                  />
                )}
                <p className="text-2xl font-serif italic">
                  {fb.employerId?.businessName || 'Unknown Employer'}
                </p>
              </div>

              <p className="text-lg text-gray-400 mb-1">
                Given on: {new Date(fb.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center my-3">
                <div className="flex items-center text-yellow-500 text-lg">
                  {renderStars(fb.rating)}
                </div>
                <span className="ml-3 text-gray-700 text-lg font-semibold">
                  {fb.rating?.toFixed(1)}
                </span>
              </div>

              <p className="italic text-lg text-gray-800">"{fb.comments}"</p>
            </div>
          ))}
        </div>

        {/* Parent Feedbacks Section */}
        <h2 className="text-3xl font-bold mb-6">Parent Feedbacks</h2>
        <div className="space-y-4">
          {parentFeedbacks.length === 0 && <p>No parent feedbacks available.</p>}

          {parentFeedbacks.map((fb) => (
            <div key={fb._id} className="border-b pb-4">
              <div className="flex items-center space-x-3 mb-1">
                <p className="text-2xl font-serif italic">
                  {fb.parentId?.email || 'Unknown Parent'}
                </p>
              </div>

              <p className="text-lg text-gray-400 mb-1">
                Given on: {new Date(fb.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center my-3">
                <div className="flex items-center text-yellow-500 text-lg">
                  {renderStars(fb.rating)}
                </div>
                <span className="ml-3 text-gray-700 text-lg font-semibold">
                  {fb.rating?.toFixed(1)}
                </span>
              </div>

              <p className="italic text-lg text-gray-800">"{fb.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsFeedBack;
