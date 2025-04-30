import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerFeedBack = () => {
  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[350px] h-[950px] p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to ="/EmployerDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to ="/EmployerMyAcc" className="text-lg font-medium mr-2 ml-2">My Account </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to ="/EmployerStaffs" className="text-lg font-medium mr-2 ml-2">Current Hired Staffs</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to ="/EmployerAppList" className="text-lg font-medium mr-2 ml-2">Applicant List</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to ="/EmployerJobPost" className="text-lg font-medium mr-2 ml-2">Post Job</Link>
        </div>
        <div className="flex items-center mb-8">
         <i className="fas fa-comments text-lg mr-2"></i>
        <Link to ="/EmployerFeedBacks" className="text-lg font-medium ml-2">Feedbacks</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white w-full h-auto p-6 shadow-md rounded-lg mt-1">
        <h2 className="text-3xl font-bold mb-4">Applicants Feedbacks</h2>
        <div className="space-y-4">
          {/* Sample Feedbacks */}
          <div className="border-b pb-4">
            <p className="text-lg font-semibold">Alice Johnson</p>
            <p className="text-sm text-gray-500">Posted on 2024-07-15</p>
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
            <p>"Working with ABC Corp has been an amazing experience. The team is supportive and the projects are interesting and challenging."</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-lg font-semibold">Michael Brown</p>
            <p className="text-sm text-gray-500">Posted on 2024-07-10</p>
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
            <p>"XYZ Inc. provides a good working environment, but there is room for improvement in terms of task management and communication."</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-lg font-semibold">Emily Davis</p>
            <p className="text-sm text-gray-500">Posted on 2024-07-05</p>
            <div className="flex items-center my-2">
              <div className="flex items-center text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
              </div>
              <span className="ml-2 text-gray-600">3.0</span>
            </div>
            <p>"LMN Ltd. has potential, but there were some challenges with the onboarding process. Overall, it was a decent experience."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerFeedBack;