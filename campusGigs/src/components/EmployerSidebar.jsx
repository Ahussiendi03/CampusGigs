import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const EmployerSidebar = () => {
  const location = useLocation();
  const [showApplicantMenu, setShowApplicantMenu] = useState(false);

  useEffect(() => {
    if (
      location.pathname === '/EmployerStaffs' ||
      location.pathname === '/EmployerAppList'
    ) {
        setShowApplicantMenu(true);
    }
  }, [location.pathname]);

  return (
    <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md flex flex-col">
      
      {/* 🧑 Employer Profile (Top Section) */}
      <div className="flex items-center mb-6 border-b border-gray-400 pb-4">
        <div className="bg-yellow-500 w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl mr-3 shadow-md">
          <i className="fas fa-user-tie"></i>
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">Employer</p>
        </div>
      </div>

      {/* 🏠 Dashboard */}
      <Link
        to="/EmployerDb"
        className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
          location.pathname === "/EmployerDb"
            ? "bg-gold shadow-md"
            : "hover:bg-gray-300"
        }`}
      >
        <i className="fas fa-home text-lg mr-2"></i>
        <span className="text-lg font-bold">Dashboard</span>
      </Link>

      {/* 👤 My Account */}
      <Link
        to="/EmployerMyAcc"
        className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
          location.pathname === "/EmployerMyAcc"
            ? "bg-gold shadow-md"
            : "hover:bg-gray-300"
        }`}
      >
        <i className="fas fa-user text-lg mr-2"></i>
        <span className="text-lg font-bold">My Account</span>
      </Link>

      {/* 👥 Applicants Dropdown */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
          onClick={() => setShowApplicantMenu(!showApplicantMenu)}
        >
          <div className="flex items-center">
            <i className="fas fa-users text-lg mr-2"></i>
            <span className="text-lg font-bold">Applicants</span>
          </div>
          <i
            className={`fas fa-chevron-${
              showApplicantMenu ? "up" : "down"
            } text-gray-700 transition-transform duration-200`}
          ></i>
        </div>

        {/* Dropdown Items */}
        {showApplicantMenu && (
          <div className="ml-6 mt-2">
            <Link
              to="/EmployerStaffs"
              className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
                location.pathname === "/EmployerStaffs"
                  ? "bg-gold shadow-md"
                  : "hover:bg-gray-300"
              }`}
            >
              <i className="fas fa-user-check text-base mr-2"></i>
              <span className="text-base font-bold">Current Hired Staffs</span>
            </Link>

            <Link
              to="/EmployerAppList"
              className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
                location.pathname === "/EmployerAppList"
                  ? "bg-gold shadow-md"
                  : "hover:bg-gray-300"
              }`}
            >
              <i className="fas fa-user-clock text-base mr-2"></i>
              <span className="text-base font-bold">Applicant List</span>
            </Link>
          </div>
        )}
      </div>

      {/* 💼 Post Job */}
      <Link
        to="/EmployerJobPost"
        className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
          location.pathname === "/EmployerJobPost"
            ? "bg-gold shadow-md"
            : "hover:bg-gray-300"
        }`}
      >
        <i className="fas fa-briefcase text-lg mr-2"></i>
        <span className="text-lg font-bold">Post Job</span>
      </Link>

      {/* 💬 Feedbacks */}
      <Link
        to="/EmployerFeedbacks"
        className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
          location.pathname === "/EmployerFeedbacks"
            ? "bg-gold shadow-md"
            : "hover:bg-gray-300"
        }`}
      >
        <i className="fas fa-comments text-lg mr-2"></i>
        <span className="text-lg font-bold">Feedbacks</span>
      </Link>
    </div>
  );
};

export default EmployerSidebar;
