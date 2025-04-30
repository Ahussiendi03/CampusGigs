import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import parttime1 from '../images/tutor.png';
import parttime2 from '../images/minuteburger.jpg';

const ApplicantsCurrentJob = () => {
  const [currentJobs, setCurrentJobs] = useState([
    {
      id: 1,
      name: 'Tutor',
      position: 'Math Tutor',
      status: 'Active',
      schedule: 'MWF / 4 PM - 6 PM',
      ratePerHour: '₱150',
      address: '789 MSU Academy',
      description: 'Help students improve their math skills through one-on-one tutoring.',
      dateApplied: 'January 18, 2025',
      image: parttime1,
    },
    {
      id: 2,
      name: 'Minute Burger',
      position: 'Food Server',
      status: 'Finished',
      schedule: 'TTh / 10 AM - 2 PM',
      ratePerHour: '₱100',
      address: '101 Campus Circle',
      description: 'Assist in preparing and serving food while maintaining cleanliness.',
      dateApplied: 'January 12, 2025',
      image: parttime2,
    },
  ]);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');

  const openRatingModal = (job) => {
    setSelectedJob(job);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedJob(null);
    setRating(null);
    setFeedback('');
  };

  const handleSubmitFeedback = (event) => {
    event.preventDefault();
    if (!rating) {
      alert('Please select a rating.');
      return;
    }
    console.log('Feedback submitted:', { job: selectedJob.name, rating, feedback });
    closeRatingModal();
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/ApplicantsDb" className="text-lg font-medium mr-2 ml-2">
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
          <Link to="/ApplicantsJobApps" className="text-lg font-medium mr-2 ml-2">
            Job Applications
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/ApplicantsCurrentJob" className="text-lg font-medium mr-2 ml-2">
            Current Job
          </Link>
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-maroon mb-4">My Current Jobs</h2>
          <p className="text-lg text-maroon-700">View your active and completed part-time jobs!</p>
        </div>

        {/* Job Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-maroon-700 text-white">
                <th className="border border-gray-300 px-6 py-3 text-left">Business</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Position</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Status</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Rate</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Schedule</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Date Applied</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-6 py-4 flex items-center">
                    <img
                      src={job.image}
                      alt={`${job.name} logo`}
                      className="w-12 h-12 mr-4 rounded-full shadow"
                    />
                    <span className="font-bold text-maroon">{job.name}</span>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">{job.position}</td>
                  <td className="border border-gray-300 px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        job.status === 'Active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    {job.ratePerHour} / hour
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">{job.schedule}</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-500">{job.dateApplied}</td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    <button
                      className="bg-maroon-700 text-white px-4 py-2 rounded-full hover:bg-gold hover:text-maroon transition"
                      onClick={() => openRatingModal(job)}
                    >
                      Rate Part-Time Job
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rating Modal */}
        {isRatingModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4 text-center">Rate {selectedJob.name}</h3>
              <form onSubmit={handleSubmitFeedback}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Rating:</label>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`text-2xl ${
                          rating >= star ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Feedback:</label>
                  <textarea
                    className="w-full border border-gray-300 p-2 rounded"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
                    onClick={closeRatingModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-maroon-700 text-white px-4 py-2 rounded hover:bg-gold hover:text-maroon"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsCurrentJob;