import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerDb = () => {
  const navigate = useNavigate();
  const [showApplicantMenu, setShowApplicantMenu] = useState(false);
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);

  const employerId = localStorage.getItem('employerId');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingRes = await axios.get(`http://localhost:5000/api/applications/pending-applicants/${employerId}`);
        setPendingApplicants(pendingRes.data);

        const approvedRes = await axios.get(`http://localhost:5000/api/applications/approved-applicants/${employerId}`);
        setApprovedApplicants(approvedRes.data);

        const jobRes = await axios.get('http://localhost:5000/api/jobposts/employer', {
          params: { employerId, status: 'approved' },
        });
        setJobPosts(jobRes.data);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    if (employerId) {
      fetchData();
    }
  }, [employerId]);

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
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
      <div className="flex-1 flex flex-col items-center justify-start mb-48 p-8 max-w-[1100px]">
        <div className="flex justify-between items-center w-full mb-6">
          <p className="text-3xl font-extrabold text-gray-800">
            Hello, Welcome to MSU CampusGigs!
          </p>
        </div>

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
              <p className="text-3xl font-extrabold">{jobPosts.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-user-check text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">Current Staffs</p>
              <p className="text-3xl font-extrabold">{approvedApplicants.length}</p>
            </div>
          </div>
        </div>

        {/* Current Hired Staffs Table */}
        <section className="mb-12 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">My Team (Current Hired Staffs)</h2>
            <Link to='/EmployerStaffs' className="text-yellow-600 underline font-semibold hover:text-yellow-800">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900">
                <tr>
                  <th className="text-left py-3 px-6">First Name</th>
                  <th className="text-left py-3 px-6">Last Name</th>
                  <th className="text-left py-3 px-6">Schedule</th>
                  <th className="text-left py-3 px-6">Job Position</th>
                  <th className="text-left py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedApplicants.map((staff, index) => {
                  const applicant = staff.applicantId;
                  const job = staff.jobId;

                  if (!applicant || !job) return null;

                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-6">{applicant.firstName}</td>
                      <td className="py-3 px-6">{applicant.lastName}</td>
                      <td className="py-3 px-6">{job.schedule}</td>
                      <td className="py-3 px-6">{job.position}</td>
                      <td className="py-3 px-6 text-green-600 font-semibold">{staff.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Applicants List Table */}
        <section className="mb-12 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Applicants List</h2>
            <Link to='/EmployerAppList' className="text-yellow-600 underline font-semibold hover:text-yellow-800">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900">
                <tr>
                  <th className="text-left py-3 px-6">First Name</th>
                  <th className="text-left py-3 px-6">Last Name</th>
                  <th className="text-left py-3 px-6">Email</th>
                  <th className="text-left py-3 px-6">Status</th>
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
                    <td className="py-3 px-6 text-yellow-600 font-semibold">{applicant.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Jobs Posted Table */}
        <section className="mb-12 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Jobs Posted</h2>
            <Link to='/EmployerJobPost' className="text-yellow-600 underline font-semibold hover:text-yellow-800">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900">
                <tr>
                  <th className="text-left py-3 px-6">Job Position</th>
                  <th className="text-left py-3 px-6">Salary</th>
                  <th className="text-left py-3 px-6">Schedule</th>
                  <th className="text-left py-3 px-6">Quota</th>
                  <th className="text-left py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((job, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-6">{job.position}</td>
                    {job.salaryRate}/{job.salaryRateType === 'per day' ? 'day' : 'hour'}
                    <td className="py-3 px-6">{job.schedule}</td>
                    <td className="py-3 px-6">{job.quota}</td>
                    <td className="py-3 px-6 text-yellow-700 font-semibold">{job.status}</td>
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

export default EmployerDb;
