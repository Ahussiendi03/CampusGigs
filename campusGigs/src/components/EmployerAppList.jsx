import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerAppList = () => {
  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[340px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to = "/EmployerDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <Link to ="/EmployerMyAcc" className="text-lg font-medium mr-2 ml-2">My Account </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Applicant List</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Post Job</p>
        </div>
        <div className="flex items-center mb-8">
         <i className="fas fa-comments text-lg mr-2"></i>
        <p className="text-lg font-medium ml-2">Feedbacks</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-cog text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Settings</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-sign-out-alt text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Logout</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-10">
        <div className="w-full flex justify-between items-center mb-3">
          <p className="text-xl font-bold">Applicants List</p>
        </div>
        <h2 className="mb-20 mr-3 font-bold text-base text-black bg-yellow-300 py-2 px-4 rounded w-[1000px] flex justify-between">
          <span className="mr-8">FIRST NAME</span>
          <span className="mr-9">LAST NAME</span>
          <span className="mr-6">EMAIL</span>
          <span className="mr-6">CONTACT NUMBER</span>
          <span className="mr-6">ACTION</span>
        </h2>
        </div>
      </div>
    </div>
  );
};

export default EmployerAppList;