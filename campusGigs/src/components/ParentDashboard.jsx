import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [showTutorMenu, setShowTutorMenu] = useState(false);
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [tutorPosts, setTutorPosts] = useState([]);

  const parentId = localStorage.getItem('parentId');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingRes = await axios.get(`http://localhost:5000/api/tutorApplication/pending-applicants/${parentId}`);
        setPendingApplicants(pendingRes.data);

        const approvedRes = await axios.get(`http://localhost:5000/api/tutorApplication/approved-applicants/${parentId}`);
        setApprovedApplicants(approvedRes.data);

        const tutorPostsRes = await axios.get('http://localhost:5000/api/tutorposts/parent', {
          params: { parentId, status: 'approved' },
        });
        setTutorPosts(tutorPostsRes.data);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    if (parentId) {
      fetchData();
    }
  }, [parentId]);

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
  <Link
    to="/ParentDashboard"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentDashboard'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  <Link
    to="/ParentMyAcc"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentMyAcc'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-user text-lg mr-2"></i>
    <span className="text-lg font-bold">My Account</span>
  </Link>

  {/* Dropdown for Tutors */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowTutorMenu(!showTutorMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-users text-lg mr-2"></i>
        <span className="text-lg font-bold">Tutors</span>
      </div>
      <i
        className={`fas fa-chevron-${showTutorMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showTutorMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ParentTutors"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ParentTutors'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-check text-base mr-2"></i>
          <span className="text-base font-bold">Current Hired Tutors</span>
        </Link>

        <Link
          to="/ParentAppList"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ParentAppList'
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

  <Link
    to="/ParentPostTutor"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentPostTutor'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-briefcase text-lg mr-2"></i>
    <span className="text-lg font-bold">Post Tutor</span>
  </Link>

  <Link
    to="/ParentFeedback"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentFeedback'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-comments text-lg mr-2"></i>
    <span className="text-lg font-bold">Feedbacks</span>
  </Link>
</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center mb-48 p-4 max-w-6xl">
        <div className="flex justify-between items-center w-full mb-6">
          <p className="text-2xl font-bold">Hello Parent, Welcome to MSU CampusGigs!</p>
        </div>

        {/* Summary Stats */}
        <div className="flex justify-start mb-8 w-full space-x-16 px-2">
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-users text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">Applicants</p>
              <p className="text-3xl font-extrabold">{pendingApplicants.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-briefcase text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">Jobs Posted</p>
              <p className="text-3xl font-extrabold">{tutorPosts.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-user-check text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">Approved Staffs</p>
              <p className="text-3xl font-extrabold">{approvedApplicants.length}</p>
            </div>
          </div>
        </div>
        {/* Approved Tutors Table */}
        <section className="w-full mb-12">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">My Tutors (Approved Applicants)</h2>
            <a href="#" className="text-black underline text-lg font-semibold">View All</a>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900 font-bold text-base">
                <tr>
                  <th className="py-3 px-6 text-left">First Name</th>
                  <th className="py-3 px-6 text-left">Last Name</th>
                  <th className="py-3 px-6 text-left">Schedule</th>
                  <th className="py-3 px-6 text-left">Subject</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedApplicants.map((staff, index) => {
                  const applicant = staff.applicantId;
                  const tutorJob = staff.tutorPostId;
                  if (!applicant || !tutorJob) return null;

                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-6">{applicant.firstName}</td>
                      <td className="py-3 px-6">{applicant.lastName}</td>
                      <td className="py-3 px-6">{tutorJob.schedule}</td>
                      <td className="py-3 px-6">{tutorJob.tutorType}</td>
                      <td className="py-3 px-6 text-green-600 font-semibold">{staff.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pending Applicants Table */}
        <section className="w-full mb-12">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Applicants List</h2>
            <a href="#" className="text-black underline text-lg font-semibold">View All</a>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900 font-bold text-base">
                <tr>
                  <th className="py-3 px-6 text-left">First Name</th>
                  <th className="py-3 px-6 text-left">Last Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplicants.map((applicant, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-6">{applicant.applicantId.firstName}</td>
                    <td className="py-3 px-6">{applicant.applicantId.lastName}</td>
                    <td className="py-3 px-6">{applicant.applicantId.email}</td>
                    <td className="py-3 px-6 text-yellow-700 font-semibold">{applicant.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tutor Jobs Posted Table */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Tutor Jobs Posted</h2>
            <Link to="/ParentPostTutor" className="text-black underline text-lg font-semibold">Post New</Link>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900 font-bold text-base">
                <tr>
                  <th className="py-3 px-6 text-left">Tutor Type</th>
                  <th className="py-3 px-6 text-left">Schedule</th>
                  <th className="py-3 px-6 text-left">Salary</th>
                  <th className="py-3 px-6 text-left">Quota</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {tutorPosts.map((post, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-6">{post.tutorType}</td>
                    <td className="py-3 px-6">{post.schedule}</td>
                    <td className="py-3 px-6">{post.salary}</td>
                    <td className="py-3 px-6">{post.quota}</td>
                    <td className="py-3 px-6 text-green-700 font-semibold">{post.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParentDashboard;
