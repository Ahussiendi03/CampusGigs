import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const ParentTutors = () => {
  const [hiredTutors, setHiredTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showTutorMenu, setShowTutorMenu] = useState(true);
  const location = useLocation();
  const parentId = localStorage.getItem('parentId');

  useEffect(() => {
    const fetchHiredTutors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutorApplication/approved-applicants/${parentId}`);
        setHiredTutors(response.data);
      } catch (error) {
        console.error('Error fetching hired tutors:', error);
      }
    };

    fetchHiredTutors();
  }, [parentId]);

  const handleGiveFeedback = (tutor) => {
    setSelectedTutor(tutor);
    setFeedbackRating(0);
    setFeedbackComment('');
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating < 1 || feedbackRating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/parent-feedback', {
        applicationId: selectedTutor._id,
        applicantId: selectedTutor.applicantId._id,
        parentId,
        rating: feedbackRating,
        comment: feedbackComment,
      });

      setHiredTutors(prev =>
        prev.map(t =>
          t._id === selectedTutor._id
            ? { ...t, feedbackGiven: true }
            : t
        )
      );

      alert('Feedback submitted!');
      setShowFeedbackModal(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-star fa ${i <= feedbackRating ? 'fas text-yellow-400' : 'far text-gray-400'} cursor-pointer text-2xl`}
          onClick={() => setFeedbackRating(i)}
          aria-label={`${i} Star`}
          role="button"
        />
      );
    }
    return stars;
  };

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
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full max-w-[1000px]">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">My Team (Current Hired Tutors)</p>
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
            </div>
          </div>

          {/* Table */}
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-yellow-300 text-black font-bold">
                <th className="px-4 py-3 text-left font-semibold">First Name</th>
                <th className="px-4 py-3 text-left font-semibold">Last Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {hiredTutors
                .filter(tutor => {
                  if (!tutor.applicantId) return false;
                  const fullName = `${tutor.applicantId.firstName} ${tutor.applicantId.lastName}`.toLowerCase();
                  return fullName.includes(searchQuery.toLowerCase());
                })
                .map(tutor => (
                  <tr key={tutor._id} className="border-b">
                    <td className="px-4 py-2">{tutor.applicantId.firstName}</td>
                    <td className="px-4 py-2">{tutor.applicantId.lastName}</td>
                    <td className="px-4 py-2">{tutor.applicantId.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${tutor.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {tutor.status === 'approved' ? 'Active' : tutor.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {tutor.status === 'completed' ? (
                        tutor.feedbackGiven ? (
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-600">
                            Done Feedback
                          </span>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() => handleGiveFeedback(tutor)}
                          >
                            Give Feedback
                          </button>
                        )
                      ) : (
                        <span className="text-gray-400 italic">Waiting for completion</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedTutor && selectedTutor.applicantId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Give Feedback</h2>
            <p className="mb-4">
              {selectedTutor.applicantId.firstName} {selectedTutor.applicantId.lastName}
            </p>
            <div className="flex space-x-1 mb-4 justify-center">
              {renderStars()}
            </div>
            <textarea
              className="w-full border rounded-lg p-2 mb-4 resize-none outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Leave a comment (optional)"
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentTutors;
