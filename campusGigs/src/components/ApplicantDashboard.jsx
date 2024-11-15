import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantDashboard = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [applicantId, setApplicantId] = useState(null);

  useEffect(() => {
    // Fetch approved job posts on component mount
    const fetchApprovedJobPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobPosts');
        setJobPosts(response.data);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    // Retrieve applicantId from localStorage
    const applicantId = localStorage.getItem('applicantId');
    if (applicantId) {
      setApplicantId(applicantId);
    } else {
      console.error('Applicant ID is missing. Ensure the user is logged in.');
    }

    fetchApprovedJobPosts();
  }, []);

  const handleApply = async (jobId, employerId) => {
    if (!applicantId) {
        console.error('Applicant ID is missing. Ensure the user is logged in.');
        return;
    }

    // Debugging output to ensure all values are present
    console.log('Applying to job with the following data:', { jobId, applicantId, employerId });

    // Check if jobId, applicantId, or employerId is missing
    if (!jobId) {
        console.error("Job ID is missing.");
        return;
    }
    if (!employerId) {
        console.error("Employer ID is missing.");
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/applications/apply', {
            jobId,
            applicantId,
            employerId,
        });
        console.log('Application successful:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error applying to job:', error.response.data);
        } else {
            console.error('Error applying to job:', error.message);
        }
    }
};


  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Dashboard</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to="/ApplicantsMyAcc" className="text-lg font-medium mr-2 ml-2">My Account</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <Link to="/ApplicantsFeedBacks" className="text-lg font-medium ml-2">Feedbacks</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center mb-auto p-4">
        <div className="flex justify-between items-center w-full mb-6">
          <p className="text-2xl font-bold">Hello, Welcome to MSU CampusGigs!</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-xl font-bold">Jobs Posted</p>
          </div>
          <table className="min-w-full bg-white border border-gray-200 mb-20">
            <thead>
              <tr className="bg-yellow-300 text-black font-bold text-base">
                <th className="py-2 px-4 border-b">Business Company</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Job Position</th>
                <th className="py-2 px-4 border-b">Schedule</th>
                <th className="py-2 px-4 border-b">Rate</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobPosts.length > 0 ? (
                jobPosts.map((job) => (
                  <tr key={job._id} className="bg-gray-100">
                    <td className="py-2 px-4 border-b flex items-center">
                      {job.employerId.businessImage && (
                        <img
                          src={`http://localhost:5000/${job.employerId.businessImage}`}
                          alt="Business Logo"
                          className="w-10 h-10 rounded-full mr-2"
                        />
                      )}
                      <span className="font-medium">{job.employerId.businessName}</span>
                    </td>
                    <td className="py-2 px-4 border-b">{job.address}</td>
                    <td className="py-2 px-4 border-b">{job.position}</td>
                    <td className="py-2 px-4 border-b">{job.schedule}</td>
                    <td className="py-2 px-4 border-b">{job.salaryRate}</td>
                    <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600" onClick={() => handleApply(job._id, job.employerId._id)}>Apply</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No approved job posts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
