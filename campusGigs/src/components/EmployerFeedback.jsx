import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerFeedBack = () => {
  const location = useLocation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicantMenu, setShowApplicantMenu] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/applicant-feedback/my-feedbacks', {
          withCredentials: true,
        });

        setFeedbacks(response.data);
      } catch (err) {
        setError('Failed to load feedbacks.');
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
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

  return (
    <div className="flex min-h-screen">
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
      <div className="flex-1 bg-white p-6 shadow-md rounded-lg mt-1 overflow-y-auto max-h-[950px]">
        <h2 className="text-3xl font-bold mb-4">Applicants Feedbacks</h2>

        {loading && <p>Loading feedbacks...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && feedbacks.length === 0 && <p>No feedbacks found.</p>}

        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="border-b pb-4">
              <p className="text-lg font-semibold">
                {fb.applicantId?.firstName} {fb.applicantId?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                Posted on {new Date(fb.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center my-2">
                <div className="flex items-center text-yellow-500">
                  {renderStars(fb.rating)}
                </div>
                <span className="ml-2 text-gray-600">{fb.rating.toFixed(1)}</span>
              </div>
              <p>"{fb.comments || 'No comments provided.'}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerFeedBack;
