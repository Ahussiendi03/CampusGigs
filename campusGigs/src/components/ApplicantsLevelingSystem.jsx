import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantsLevelingSystem = ({ level, progress, feedbackCount, badge, jobsCompleted }) => {
  // Define badge unlocking criteria
  const badges = {
    beginner: jobsCompleted >= 1, // Badge unlocked when 1 job is completed
    intermediate: jobsCompleted >= 5, // Badge unlocked when 5 jobs are completed
    expert: jobsCompleted >= 10, // Badge unlocked when 10 jobs are completed
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/ApplicantsDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to="/ApplicantsMyAcc" className="text-lg font-medium mr-2 ml-2">My Account</Link>
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
        <i class="fa-solid fa-chart-simple text-lg mr-2"></i>
          <Link to="/ApplicantsLevelingSystem" className="text-lg font-medium mr-2 ml-2">Level</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <Link to="/applicantsFeedback" className="text-lg font-medium ml-2">Feedbacks</Link>
        </div>

       
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center mb-72 p-4">
        {/* User's Progress and Badge Info */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-maroon-700">Level {level}</h2>
          <p className="text-xl font-semibold text-black">Badge: {badge || 'No badge yet'}</p>
        </div>

        {/* Progress Card */}
        <div className="w-[600px] bg-white rounded-xl border-2 border-yellow-600 shadow-xl p-8 mb-6 relative overflow-hidden">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Progress to Next Level</h3>
          {/* Progress Bar */}
          <div className="w-full h-6 bg-gray-300 rounded-full">
            <div className="bg-maroon-700 h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-lg mt-2 text-gray-800">{progress}% to next level</p>
          {/* Floating Element */}
          <div className="absolute top-0 right-0 bg-maroon-700 text-white p-2 rounded-bl-xl shadow-lg">Next Level!</div>
        </div>

        {/* Feedback and Jobs Completed Section */}
        <div className="flex justify-around w-full mb-6">
          {/* Feedback Card */}
          <div className="w-[280px] bg-white border-2 border-maroon-700 rounded-lg shadow-md p-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Feedback Received</h3>
            <p className="text-lg font-bold text-black mt-2">{feedbackCount}</p>
            <Link to="/ApplicantsFeedBacks" className="bg-maroon-700 hover:bg-black text-white font-bold py-2 px-4 rounded-lg mt-4 inline-block">
              View Feedback
            </Link>
          </div>

          {/* Jobs Completed Card */}
          <div className="w-[280px] bg-white border-2 border-maroon-700 rounded-lg shadow-md p-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Jobs Completed</h3>
            <p className="text-lg font-bold text-black mt-2">{jobsCompleted}</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Badges</h3>
          <div className="flex gap-6">
            {/* Beginner Badge */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${badges.beginner ? 'bg-yellow-400' : 'bg-gray-400'}`}>
              <i className="fas fa-star text-3xl text-white"></i>
            </div>
            {/* Intermediate Badge */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${badges.intermediate ? 'bg-yellow-200' : 'bg-gray-400'}`}>
              <i className="fas fa-star text-3xl text-white"></i>
            </div>
            {/* Expert Badge */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${badges.expert ? 'bg-yellow-200' : 'bg-gray-400'}`}>
              <i className="fas fa-star text-3xl text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsLevelingSystem;