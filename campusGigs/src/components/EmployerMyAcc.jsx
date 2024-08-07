import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import signUpImage2 from '../images/Login_Page_Website_UI_Prototype__8_-removebg-preview.png';

const EmployerMyAcc = () => {
  return (
    <div className="flex justify-center relative">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[300px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/EmployerDb" className="text-lg font-medium mr-2 ml-2">Dashboard</Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">My Account</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to ="/EmployerAppList" className="text-lg font-medium mr-2 ml-2">Applicant List</Link>
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
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between mb-5 relative">
          <p className="bg-gray-200 w-[300px] text-center text-4xl font-bold mb-5 mt-3">MY ACCOUNT</p>
          <div className="absolute right-0 top-0 flex flex-col items-end">
            <img src={signUpImage2} className="mt-4 w-8/12 h-8/12 mb-2" />
            <Link to="" className="mr-28 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[200px]">
              Edit Profile Picture
            </Link>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-6 ml-7">
            <p className="text-1xl font-bold">FIRST NAME:</p>
            <button className="ml-2 text-black hover:text-gray-800">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="flex items-center mb-6 ml-7">
            <p className="text-1xl font-bold">LAST NAME:</p>
            <button className="ml-2 text-black hover:text-gray-800">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="flex items-center mb-6 ml-7">
            <p className="text-1xl font-bold">BUSINESS NAME:</p>
            <button className="ml-2 text-black hover:text-gray-800">
              <i className="fas fa-edit"></i>
            </button>
          </div>          
          <div className="flex items-center mb-6 ml-7">
            <p className="text-1xl font-bold">CONTACT NUMBER:</p>
            <button className="ml-2 text-black hover:text-gray-800">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="flex items-center mb-6 ml-7">
            <p className="text-1xl font-bold">ADDRESS:</p>
            <button className="ml-2 text-black hover:text-gray-800">
              <i className="fas fa-edit"></i>
            </button>
          </div>
            <p className="ml-7 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[220px]">
            Update Business Permit
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerMyAcc;