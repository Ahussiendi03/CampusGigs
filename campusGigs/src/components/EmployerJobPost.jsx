import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerJobPost = () => {
  const navigate = useNavigate();

  // State to store job posts and employer data
  const [jobPosts, setJobPosts] = useState([]);
  const [employerData, setEmployerData] = useState({ businessName: '', businessImage: '' });

  const [showModal, setShowModal] = useState(false);
  const [jobData, setJobData] = useState({
    address: '',
    position: '',
    schedule: '',
    salaryRate: ''
  });

  // Fetch employer data and approved job posts when the component mounts
  useEffect(() => {
    const fetchEmployerData = async () => {
      const employerId = localStorage.getItem('employerId');
      try {
        const response = await axios.get(`http://localhost:5000/api/jobPosts/employers/${employerId}`);
        setEmployerData(response.data);
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    };
    

    const fetchApprovedJobPosts = async () => {
      try {
        const employerId = localStorage.getItem('employerId');
        // Fetch only approved job posts for this employer
        const response = await axios.get('http://localhost:5000/api/jobposts/employer', {
          params: { employerId, status: 'approved' },
        });
        setJobPosts(response.data);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    fetchEmployerData();
    fetchApprovedJobPosts();
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const employerId = localStorage.getItem('employerId');
    if (!employerId) {
      console.error('Employer ID is not defined');
      alert('Employer ID is not defined. Please log in again.');
      return;
    }

    const newJobData = {
      employerId,
      businessName: employerData.businessName,
      businessImage: employerData.businessImage,
      address: jobData.address,
      position: jobData.position,
      schedule: jobData.schedule,
      salaryRate: jobData.salaryRate,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/jobposts/create', newJobData);
      console.log('Job posted successfully:', response.data);
      setShowModal(false);
      setJobData({ address: '', position: '', schedule: '', salaryRate: '' });
    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex justify-center">
    {/* Sidebar */}
    <div className="bg-gray-200 w-[340px] h-[950px] rounded-lg p-4 shadow-md">
      <div className="flex items-center mb-8">
        <i className="fas fa-home text-lg mr-2"></i>
        <Link to="/EmployerDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
      </div>
      <div className="flex items-center mb-8">
        <i className="fas fa-user text-lg mr-2"></i>
        <Link to="/EmployerMyAcc" className="text-lg font-medium mr-2 ml-2">My Account</Link>
      </div>
      <div className="flex items-center mb-8">
        <i className="fas fa-users text-lg mr-2"></i>
        <Link to="/EmployerStaffs" className="text-lg font-medium mr-2 ml-2">Current Hired Staffs</Link>
      </div>
      <div className="flex items-center mb-8">
        <i className="fas fa-users text-lg mr-2"></i>
        <Link to="/EmployerAppList" className="text-lg font-medium mr-2 ml-2">Applicant List</Link>
      </div>
      <div className="flex items-center mb-8">
        <i className="fas fa-briefcase text-lg mr-2"></i>
        <Link to="/EmployerJobPost" className="text-lg font-medium mr-2 ml-2">Post Job</Link>
      </div>
      <div className="flex items-center mb-8">
        <i className="fas fa-comments text-lg mr-2"></i>
        <Link to="/EmployerFeedBacks" className="text-lg font-medium ml-2">Feedbacks</Link>
      </div>
    </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          {/* Business Info */}
          

          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Approved Jobs Posted</p>
            <div className="flex items-center ml-auto">
              <p
                onClick={toggleModal}
                className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[150px] mr-4 cursor-pointer"
              >
                + Post a Job
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
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
          <td className="py-2 px-4 border-b">{job.salaryRate}</td>
          <td className="py-2 px-4 border-b">{job.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>

        </div>
      </div>

       {/* Modal */}
       {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={jobData.address}
                    onChange={handleInputChange}
                    className="border border-gray-400 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                    Job Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={jobData.position}
                    onChange={handleInputChange}
                    className="border border-gray-400 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schedule">
                    Schedule
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    id="schedule"
                    value={jobData.schedule}
                    onChange={handleInputChange}
                    className="border border-gray-400 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salaryRate">
                    Salary Rate
                  </label>
                  <input
                    type="text"
                    name="salaryRate"
                    id="salaryRate"
                    value={jobData.salaryRate}
                    onChange={handleInputChange}
                    className="border border-gray-400 rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="py-2 px-4 bg-gray-400 text-white font-bold rounded-lg mr-2"
                    onClick={toggleModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default EmployerJobPost;
