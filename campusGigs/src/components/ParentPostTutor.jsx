import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ParentPostTutor = () => {
  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to ="/ParentDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to ="/ParentMyAcc" className="text-lg font-medium mr-2 ml-2">My Account </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to ="/ParentTutors" className="text-lg font-medium mr-2 ml-2">Current Hired Tutors</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to ="/ParentAppList" className="text-lg font-medium mr-2 ml-2">Applicant List</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to ="/ParentPostTutor" className="text-lg font-medium mr-2 ml-2">Post Tutor</Link>
        </div>
        <div className="flex items-center mb-8">
         <i className="fas fa-comments text-lg mr-2"></i>
        <Link to ="" className="text-lg font-medium ml-2">Feedbacks</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Jobs Posted</p>
            <div className="flex items-center ml-auto">
              <p className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[150px] mr-4">
                + Post a Tutor
              </p>
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search Job"
                  className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
              </div>
            </div>
          </div>
          <h2 className="mb-20 mr-3 font-bold text-base text-black bg-yellow-300 py-2 px-4 rounded w-[1000px] flex justify-between">
          <span className="mr-6">TUTOR TYPE</span>
          <span className="mr-6">ADDRESS</span>
          <span className="mr-6">SCHEDULE</span>
          <span className="mr-6">SALARY</span>
          <span className="mr-6">ACTION</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ParentPostTutor;