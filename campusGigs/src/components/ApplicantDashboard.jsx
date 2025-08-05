import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentJobs, setCurrentJobs] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [showAccMenu, setShowAccMenu] = useState(false);
const [showJobMenu, setShowJobMenu] = useState(false);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) return console.error('No token found');

        const decoded = jwtDecode(token);
        const applicantId =
          decoded.applicantId || decoded.userId || decoded.id || decoded.email;
        if (!applicantId) return console.error('Applicant ID is undefined');

        const pendingRes = await axios.get(
          'http://localhost:5000/api/applications/job-applications',
          { withCredentials: true }
        );
        setPendingApplications(pendingRes.data);

        const completedRes = await axios.get(
          `http://localhost:5000/api/applications/completed/${applicantId}`
        );

        const formattedCompleted = completedRes.data.map((entry) => ({
          type: entry.type,
          company: entry.company,
          position: entry.position,
          schedule: entry.schedule,
          completionDate: entry.completionDate,
        }));
        setCompletedJobs(formattedCompleted);

        const [jobRes, tutorRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/applications/approved/${applicantId}`),
          axios.get(`http://localhost:5000/api/tutorApplication/approved/${applicantId}`),
        ]);

        const filteredJobRes = jobRes.data.filter(
          (app) => app.status === 'approved' && !app.completionDate
        );
        const filteredTutorRes = tutorRes.data.filter(
          (app) => app.status === 'approved' && !app.completionDate
        );

        const formattedJobApps = filteredJobRes.map((app) => ({
          ...app,
          type: 'job',
          position: app.jobId?.position,
          salaryRate: app.jobId?.salaryRate,
          schedule: app.jobId?.schedule,
          applicationDate: app.applicationDate,
          image: app.employerId?.businessImage,
          name: app.employerId?.businessName,
        }));

        const formattedTutorApps = filteredTutorRes.map((app) => ({
          ...app,
          type: 'tutor',
          position: app.tutorPostId?.tutorType,
          salaryRate: app.tutorPostId?.salary,
          schedule: app.tutorPostId?.schedule,
          applicationDate: app.createdAt,
          image: null,
          name: 'Tutor',
        }));

        setCurrentJobs([...formattedJobApps, ...formattedTutorApps]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchAllDashboardData();
  }, []);

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
    <div className="flex justify-center">
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
      <div className="flex-1 flex flex-col items-center justify-center mb-80 p-4">
        <div className="flex justify-between items-center w-full mb-6">
          <p className="text-2xl font-bold">Hello, Welcome to MSU CampusGigs!</p>
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
          </div> */}
        </div>

        {/* Summary Cards */}
        <div className="flex justify-start mb-6 w-full">
          <div className="flex items-center space-x-16 p-4">
            <div className="flex items-center space-x-4">
              <i className="fas fa-tasks text-maroon-700 text-6xl"></i>
              <div>
                <p className="text-lg font-medium text-maroon-700">Jobs Completed</p>
                <p className="text-xl font-bold">{completedJobs.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-clock text-maroon-700 text-6xl"></i>
              <div>
                <p className="text-lg font-medium text-maroon-700">Job Applications</p>
                <p className="text-xl font-bold">{pendingApplications.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-briefcase text-maroon-700 text-6xl"></i>
              <div>
                <p className="text-lg font-medium text-maroon-700">Current Jobs</p>
                <p className="text-xl font-bold">{currentJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Jobs Table */}
        <section className="mb-12 w-full">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-gray-800">Current Jobs</h2>
  </div>
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="min-w-full bg-white">
      <thead className="bg-yellow-300 text-yellow-900">
        <tr>
          <th className="text-left py-3 px-6">Company</th>
          <th className="text-left py-3 px-6">Position</th>
          <th className="text-left py-3 px-6">Schedule</th>
          <th className="text-left py-3 px-6">Status</th>
        </tr>
      </thead>
      <tbody>
        {currentJobs.length > 0 ? (
          currentJobs.map((job, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
              }`}
            >
              <td className="py-3 px-6">{job.name}</td>
              <td className="py-3 px-6">{job.position}</td>
              <td className="py-3 px-6">{job.schedule}</td>
              <td className="py-3 px-6 text-green-600 font-semibold">Approved</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              No current jobs assigned.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>

        {/* Pending Applications Table */}
        <section className="mb-12 w-full">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
  </div>
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="min-w-full bg-white">
      <thead className="bg-yellow-300 text-yellow-900">
        <tr>
          <th className="text-left py-3 px-6">Company</th>
          <th className="text-left py-3 px-6">Position</th>
          <th className="text-left py-3 px-6">Schedule</th>
          <th className="text-left py-3 px-6">Status</th>
        </tr>
      </thead>
      <tbody>
        {pendingApplications.map((app, index) => (
          <tr
            key={index}
            className={`border-b border-gray-200 ${
              index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
            }`}
          >
            <td className="py-3 px-6">{app.employerId?.businessName || 'N/A'}</td>
            <td className="py-3 px-6">{app.jobId?.position || 'N/A'}</td>
            <td className="py-3 px-6">{app.jobId?.schedule || 'N/A'}</td>
            <td className="py-3 px-6 text-yellow-600 font-semibold">{app.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

{/* === Completed Jobs Table === */}
<section className="mb-12 w-full">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-gray-800">Jobs Completed</h2>
  </div>
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="min-w-full bg-white">
      <thead className="bg-yellow-300 text-yellow-900">
        <tr>
          <th className="text-left py-3 px-6">Company</th>
          <th className="text-left py-3 px-6">Position</th>
          <th className="text-left py-3 px-6">Schedule</th>
          <th className="text-left py-3 px-6">Completion Date</th>
        </tr>
      </thead>
      <tbody>
        {completedJobs.map((job, index) => (
          <tr
            key={index}
            className={`border-b border-gray-200 ${
              index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
            }`}
          >
            <td className="py-3 px-6">{job.company}</td>
            <td className="py-3 px-6">{job.position}</td>
            <td className="py-3 px-6">{job.schedule}</td>
            <td className="py-3 px-6">
              {job.completionDate
                ? new Date(job.completionDate).toLocaleDateString()
                : 'N/A'}
            </td>
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

export default ApplicantDashboard;
