import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantsFeedBack = () => {
  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to ="/ApplicantsDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to ="/ApplicantsMyAcc" className="text-lg font-medium mr-2 ml-2">My Account </Link>
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
          <i className="fas fa-chart-simple text-lg mr-2"></i>
          <Link to ="/ApplicantsLevelingSystem" className="text-lg font-medium mr-2 ml-2">Level </Link>
        </div>
        <div className="flex items-center mb-8">
         <i className="fas fa-comments text-lg mr-2"></i>
        <Link to ="/applicantsFeedback" className="text-lg font-medium ml-2">Feedbacks</Link>
        </div>
        
      
      </div>

      {/* Main Content */}
      <div className="bg-white w-full h-auto p-6 shadow-md rounded-lg mt-1">
        <h2 className="text-3xl font-bold mb-6">Employer Feedbacks</h2>
        <div className="space-y-4">
          {/* Example Feedback */}
          <div className="border-b pb-4">
            <p className="text-lg font-semibold">Employer: ABC Corporation</p>
            <p className="text-sm text-gray-500">Feedback to: John Doe</p>
            <div className="flex items-center my-2">
              <div className="flex items-center text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
              </div>
              <span className="ml-2 text-gray-600">4.0</span>
            </div>
            <p>"John demonstrated strong technical skills and was a quick learner during the interview process. While he needs to work on his communication skills, he is a promising candidate."</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-lg font-semibold">Employer: XYZ Tech</p>
            <p className="text-sm text-gray-500">Feedback to: Jane Smith</p>
            <div className="flex items-center my-2">
              <div className="flex items-center text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <i className="far fa-star"></i>
              </div>
              <span className="ml-2 text-gray-600">3.5</span>
            </div>
            <p>"Jane has a good understanding of the job requirements and performed well during her assessment. However, her time management could be improved for better efficiency."</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-lg font-semibold">Employer: Startup Inc.</p>
            <p className="text-sm text-gray-500">Feedback to: Alex Brown</p>
            <div className="flex items-center my-2">
              <div className="flex items-center text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="ml-2 text-gray-600">5.0</span>
            </div>
            <p>"Alex is an outstanding candidate. His problem-solving abilities and proactive approach made him stand out. We are excited to see what he will bring to the team."</p>
          </div>

          {/* Add more feedbacks as needed */}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsFeedBack;