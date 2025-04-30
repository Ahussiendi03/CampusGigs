import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantDashboard = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [applicantId, setApplicantId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchApprovedJobPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobPosts');
        setJobPosts(response.data);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };

    const storedApplicantId = localStorage.getItem('applicantId');
    if (storedApplicantId) {
      setApplicantId(storedApplicantId);
    } else {
      console.error('Applicant ID is missing. Ensure the user is logged in.');
    }

    fetchApprovedJobPosts();
  }, []);

  const handleApply = async () => {
    if (!applicantId || !selectedJob || !selectedJob._id || !selectedJob.employerId?._id) {
      console.error('Missing required values:', {
        applicantId,
        jobId: selectedJob?._id,
        employerId: selectedJob?.employerId?._id,
      });
      alert('Error: Missing required data.');
      return;
    }
  
    try {
      console.log('Sending application request:', {
        jobId: selectedJob._id,
        applicantId,
        employerId: selectedJob.employerId._id,
      });
  
      const response = await axios.post('http://localhost:5000/api/applications/apply', {
        jobId: selectedJob._id,
        applicantId,
        employerId: selectedJob.employerId._id,
      });
  
      console.log('Application successful:', response.data);
      alert('Application submitted successfully.');
    } catch (error) {
      console.error('Error applying to job:', error.response?.data || error.message);
      alert(`${error.response?.data?.message || 'You have already applied in this job'}`);
    }
  
    setShowConfirmModal(false);
  };
  

  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const openConfirmModal = (job) => {
    setSelectedJob(job);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-200 w-[280px] h-[950px] p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/applicantDashboard" className="text-lg font-medium mr-2 ml-2">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to="/ApplicantsMyAcc" className="text-lg font-medium mr-2 ml-2">
            My Account
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/ApplicantsJobApps" className="text-lg font-medium mr-2 ml-2">Job Applications</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/ApplicantsCurrentJob" className="text-lg font-medium mr-2 ml-2">Current Job</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fa-solid fa-chart-simple text-lg mr-2"></i>
          <Link to="/ApplicantsLevelingSystem" className="text-lg font-medium mr-2 ml-2">
            Level
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <Link to="/applicantsFeedback" className="text-lg font-medium ml-2">
            Feedbacks
          </Link>
        </div>
        
      </div>

      <div className="flex-1 p-6 mt-2">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-maroon mb-2">Available Job Opportunities</h2>
        </div>

        <div className="ml-16 grid grid-cols-3 gap-6">
          {jobPosts.map((job) => (
            <div
              key={job._id}
              className="bg-gray-200 border-2 border-maroon-700 shadow-lg rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105"
              style={{ height: '420px', maxWidth: '260px' }}
            >
              <div className="relative w-full h-2/3">
                {job.employerId.businessImage && (
                  <img
                    src={`http://localhost:5000/${job.employerId.businessImage}`}
                    alt="Business Logo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-4">
                <p className="text-lg text-black font-bold text-center mb-1">
                  {job.employerId.businessName}
                </p>
                <p className="text-lg text-black text-center mb-2">
                  <span className="font-semibold">Job Position:</span> {job.position}
                </p>

                <div className="flex justify-between">
                  <button
                    onClick={() => openModal(job)}
                    className="bg-maroon-700 text-white py-2 px-4 rounded-full hover:bg-gold hover:text-maroon transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openConfirmModal(job)}
                    className="bg-maroon-700 text-white py-2 px-4 rounded-full hover:bg-gold hover:text-maroon transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-1/3">
            <h3 className="text-xl font-bold mb-4">Are you sure you want to apply for this job?</h3>
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

      {showModal && (
        <div
        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
        onClick={closeModal} // Close modal when clicking outside
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-3xl relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
        >
          <div className="flex items-center mb-4">
            <div className="w-1/3">
              {selectedJob.employerId.businessImage && (
                <img
                  src={`http://localhost:5000/${selectedJob.employerId.businessImage}`}
                  alt="Business Logo"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>
            <div className="w-2/3 pl-4">
              <h3 className="text-2xl font-bold mb-2">{selectedJob.position}</h3>
              <p><strong>BusinessName:</strong> {selectedJob.employerId.businessName}</p>
              <p><strong>Address:</strong> {selectedJob.address}</p>
              <p><strong>Schedule:</strong> {selectedJob.schedule}</p>
              <p><strong>Salary Rate:</strong> {selectedJob.salaryRate}</p>
            </div>
          </div>

          {/* Close Button Positioned at the Bottom Right */}
          <button
            onClick={closeModal}
            className="absolute bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-full shadow-lg hover:bg-gray-700"
          >
            ✕ Close
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;
