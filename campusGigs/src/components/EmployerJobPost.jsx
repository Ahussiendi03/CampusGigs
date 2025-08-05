import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerJobPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showApplicantMenu, setShowApplicantMenu] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);
  const [employerData, setEmployerData] = useState({ businessName: '', businessImage: '', streetAddress: '' });
  const [savedPositions, setSavedPositions] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const [showPostModal, setShowPostModal] = useState(false);
  const [jobData, setJobData] = useState({
    address: '',
    position: '',
    salaryRate: '',
    salaryRateType: 'per hour',
    quota: '',
    days: [],
    startTime: '',
    endTime: '',
  });

  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);

  const employerId = localStorage.getItem('employerId');

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobPosts/employers/${employerId}`);
        setEmployerData(response.data);
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    };

    const fetchApprovedJobPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobposts/employer', {
          params: { employerId, status: 'approved' },
        });
        setJobPosts(response.data);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    const fetchSavedPositions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employer/${employerId}/positions`);
        setSavedPositions(response.data.positions || []);
      } catch (error) {
        console.error('Error fetching saved positions:', error);
      }
    };

    fetchEmployerData();
    fetchApprovedJobPosts();
    fetchSavedPositions();
  }, [employerId]);

  const togglePostModal = () => setShowPostModal(!showPostModal);
  const toggleDismissModal = () => setShowDismissModal(!showDismissModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setJobData((prev) => {
      const newDays = checked
        ? [...prev.days, value]
        : prev.days.filter((day) => day !== value);
      return { ...prev, days: newDays };
    });
  };

  const handleDismissReasonChange = (e) => {
    setDismissReason(e.target.value);
  };

  const openDismissModal = (jobId) => {
    setSelectedJobId(jobId);
    setDismissReason('');
    setShowDismissModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { position, salaryRate, quota, days, startTime, endTime } = jobData;

    if (!quota || Number(quota) <= 0) return alert('Enter a valid quota > 0.');
    if (days.length === 0) return alert('Select at least one day.');
    if (!startTime || !endTime) return alert('Enter both start and end time.');
    if (endTime <= startTime) return alert('End time must be after start time.');

    const scheduleStr = `${days.join(', ')} ${startTime} - ${endTime}`;
    const newJobData = {
      employerId,
      address: employerData.streetAddress,
      position,
      schedule: scheduleStr,
      salaryRate,
      salaryRateType: jobData.salaryRateType,
      quota: Number(quota),
    };

    try {
      await axios.post('http://localhost:5000/api/jobposts/create', newJobData);
      setShowPostModal(false);
      setJobData({ address: '', position: '', salaryRate: '', quota: '', days: [], startTime: '', endTime: '' });

      // Refresh job posts
      const updated = await axios.get('http://localhost:5000/api/jobposts/employer', {
        params: { employerId, status: 'approved' },
      });
      setJobPosts(updated.data);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to post job.';
      setErrorMessage(message);
      setShowErrorModal(true);
      console.error('Error posting job:', message);
    }
  };

  const handleDismissSubmit = async () => {
    if (!dismissReason.trim()) return alert('Enter a reason for dismissal.');
    try {
      await axios.put(`http://localhost:5000/api/jobposts/dismiss/${selectedJobId}`, {
        reason: dismissReason,
      });

      const response = await axios.get('http://localhost:5000/api/jobposts/employer', {
        params: { employerId, status: 'approved' },
      });
      setJobPosts(response.data);
      setShowDismissModal(false);
      setSelectedJobId(null);
      setDismissReason('');
    } catch (error) {
      console.error('Error dismissing job post:', error.response?.data || error.message);
    }
  };

  const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sat', 'Sun'];

  return (
    <div className="flex">
      {/* Sidebar -- keep your existing sidebar code here */}
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
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Jobs Posted</p>
            <div className="flex items-center ml-auto">
              <p
                onClick={togglePostModal}
                className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[150px] mr-4 cursor-pointer"
              >
                + Post a Job
              </p>
            </div>
          </div>

          {/* Table of job posts */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-yellow-300 text-black font-bold text-base">
                  <th className="py-2 px-4 border-b">Business Company</th>
                  <th className="py-2 px-4 border-b">Address</th>
                  <th className="py-2 px-4 border-b">Job Position</th>
                  <th className="py-2 px-4 border-b">Schedule</th>
                  <th className="py-2 px-4 border-b">Rate</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((job) => (
                  <tr key={job._id} className="bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center">
                        {employerData.businessImage && (
                          <img
                            src={`http://localhost:5000/${employerData.businessImage}`}
                            alt="Business Logo"
                            className="w-10 h-10 rounded-full mr-2"
                          />
                        )}
                        <span className="font-medium">{employerData.businessName}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{job.address}</td>
                    <td className="py-2 px-4 border-b">{job.position}</td>
                    <td className="py-2 px-4 border-b">{job.schedule}</td>
                    <td className="py-2 px-4 border-b">
                      {job.salaryRate}/{job.salaryRateType === 'per day' ? 'day' : 'hour'}
                    </td>

                    <td className="py-2 px-4 border-b">{job.status}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openDismissModal(job._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                      >
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Post Job Modal */}
        {showPostModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 w-[550px] max-h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={employerData.streetAddress || ''}
                    disabled
                    className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Job Position:</label>
                  <select
                    className="border border-gray-300 rounded p-2 w-full mb-2"
                    value={jobData.position}
                    onChange={(e) => setJobData((prev) => ({ ...prev, position: e.target.value }))}
                  >
                    <option value="">-- Select from previous --</option>
                    {savedPositions.map((pos, index) => (
                      <option key={index} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter a new position"
                    value={jobData.position}
                    onChange={(e) => setJobData((prev) => ({ ...prev, position: e.target.value }))}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Schedule (Select Days):</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="days"
                          value={day}
                          checked={jobData.days.includes(day)}
                          onChange={handleDayChange}
                          className="mr-1"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Start Time:</label>
                  <input
                    type="time"
                    name="startTime"
                    value={jobData.startTime}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">End Time:</label>
                  <input
                    type="time"
                    name="endTime"
                    value={jobData.endTime}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
  <label className="block font-semibold mb-1">
    Salary Rate: (Reminder! Default is PER HOUR)
  </label>
  <div className="flex items-center gap-2 mb-2">
    <input
      type="number"
      name="salaryRate"
      value={jobData.salaryRate}
      onChange={handleInputChange}
      className="border border-gray-300 rounded p-2 w-full"
      required
    />
    <span className="text-sm text-gray-600">
      {jobData.salaryRateType === 'per day' ? '₱/day' : '₱/hour'}
    </span>
  </div>
  <label className="inline-flex items-center mt-1">
    <input
      type="checkbox"
      checked={jobData.salaryRateType === 'per day'}
      onChange={() =>
        setJobData((prev) => ({
          ...prev,
          salaryRateType: prev.salaryRateType === 'per day' ? 'per hour' : 'per day',
        }))
      }
      className="mr-2"
    />
    Click this box if you want (PER DAY)
  </label>
</div>



                <div>
                  <label className="block font-semibold mb-1">Quota:</label>
                  <input
                    type="number"
                    name="quota"
                    value={jobData.quota}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    min="1"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={togglePostModal}
                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-6 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-maroon-700 hover:bg-maroon-800 text-yellow-300 font-semibold py-2 px-6 rounded"
                  >
                    Post Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dismiss Modal */}
        {showDismissModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[400px]">
              <h2 className="text-xl font-bold mb-4">Dismiss Job Post</h2>
              <textarea
                value={dismissReason}
                onChange={handleDismissReasonChange}
                placeholder="Enter reason for dismissal"
                rows={4}
                className="w-full border border-gray-300 rounded p-2 mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={toggleDismissModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDismissSubmit}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Job Post Error</h2>
              <p className="text-gray-700 mb-6">{errorMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="bg-maroon-700 hover:bg-maroon-800 text-yellow-300 font-semibold py-2 px-6 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployerJobPost;
