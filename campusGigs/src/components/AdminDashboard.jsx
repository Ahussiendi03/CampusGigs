import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


const AdminDashboard = () => {
  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[280px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to ="/AdminDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to ="/AdminAccReg" className="text-lg font-medium mr-2 ml-2">Manage Account Registrations</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to ="/AdminManageJob" className="text-lg font-medium mr-2 ml-2">Manage Job Posts</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to ="/AdminManageTutor" className="text-lg font-medium mr-2 ml-2">Manage Tutor Posts</Link>
        </div>
        <div className="flex items-center mb-8">
         <i className="fas fa-comments text-lg mr-2"></i>
        <Link to ="" className="text-lg font-medium ml-2">Manage Feedbacks</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center mb-48 p-4">
        <div className="flex justify-between items-center w-full mb-6">
          <p className="text-2xl font-bold">Hello Sodais, Welcome to MSU CampusGigs!</p>
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-black rounded-lg px-4 py-2 w-[300px] outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
          </div>
        </div>
        <div className="flex justify-start mb-4 w-full">
          <div className="flex items-center space-x-16 p-4">
            <div className="flex items-center space-x-4">
              <i className="fas fa-users text-maroon-700 text-6xl"></i>
              <div>
                <p className="text-lg font-medium text-maroon-700">Account Registered</p>
                <p className="text-xl font-bold">1258</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-briefcase text-maroon-700 text-6xl"></i>
              <div>
                <p className="text-lg font-medium text-maroon-700">Jobs Posted</p>
                <p className="text-xl font-bold">31</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-briefcase text-maroon-700 text-6xl"></i>
              <div>
                <p className="text-lg font-medium text-maroon-700">Tutors Posted</p>
                <p className="text-xl font-bold">31</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
        <div className="w-full flex justify-between items-center mb-3">
          <p className="text-xl font-bold">Pending Account Registration List</p>
          <Link to ="/AdminAccReg" className="text-black underline mr-4 mt-1 text-lg font-semi">View All</Link>
        </div>
        <h2 className="mb-20 mr-3 font-bold text-base text-black bg-yellow-300 py-2 px-4 rounded w-[1000px] flex justify-between">
          <span className="mr-6">ACCOUNT TYPE</span>
          <span className="mr-6">FIRST NAME</span>
          <span className="mr-10">LAST NAME</span>
          <span className="mr-9">EMAIL</span>
          <span className="mr-7">CONTACT NUMBER</span>
          <span className="mr-4">ACTION</span>
        </h2>
        <div className="w-full flex justify-between items-center mb-3">
          <p className="text-xl font-bold">Pending Job Posts</p>
          <Link to ="/EmployerJobPost" className="text-black underline mr-4 mt-1 text-lg font-semi">View All</Link>
        </div>
        <h2 className="mb-20 mr-3 font-bold text-base text-black bg-yellow-300 py-2 px-4 rounded w-[1000px] flex justify-between">
          <span className="mr-8">BUSINESS COMPANY</span>
          <span className="mr-6">ADDRESS</span>
          <span className="mr-6">JOB POSITION</span>
          <span className="mr-6">SCHEDULE</span>
          <span className="mr-6">ACTION</span>
        </h2>
        <div className="w-full flex justify-between items-center mb-3">
          <p className="text-xl font-bold">Pending Tutor Posts</p>
          <Link to ="/EmployerJobPost" className="text-black underline mr-4 mt-1 text-lg font-semi">View All</Link>
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

export default AdminDashboard;