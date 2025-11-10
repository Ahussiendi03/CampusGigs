import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [showGigMenu, setShowGigMenu] = useState(false);

  // ✅ Keep dropdown open when inside gig-related routes
  useEffect(() => {
    if (
      location.pathname === '/AdminManageJob' ||
      location.pathname === '/AdminManageTutor'
    ) {
      setShowGigMenu(true);
    }
  }, [location.pathname]);

  return (
    <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md flex flex-col">
      
      {/* ✅ Admin Profile Section (TOP) */}
      <div className="flex items-center mb-6 border-b border-gray-400 pb-4">
        <div className="bg-yellow-500 w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl mr-3 shadow-md">
          <i className="fas fa-user-shield"></i>
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">Administrator</p>
          <p className="text-sm text-gray-600">System Admin</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-1">
        {/* Dashboard */}
        <Link
          to="/AdminDashboard"
          className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/AdminDashboard'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-home text-lg mr-2"></i>
          <span className="text-lg font-bold">Dashboard</span>
        </Link>

        {/* Manage Account Registrations */}
        <Link
          to="/AdminManageRegister"
          className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/AdminManageRegister'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user text-lg mr-2"></i>
          <span className="text-lg font-bold">Manage Account Registrations</span>
        </Link>

        {/* Manage Gigs Dropdown */}
        <div className="mb-4">
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer ${
              location.pathname === '/AdminManageJob' ||
              location.pathname === '/AdminManageTutor'
                ? 'bg-gold shadow-md'
                : 'hover:bg-gray-300'
            }`}
            onClick={() => setShowGigMenu(!showGigMenu)}
          >
            <div className="flex items-center">
              <i className="fas fa-briefcase text-lg mr-2"></i>
              <span className="text-lg font-bold">Manage Gigs</span>
            </div>
            <i
              className={`fas fa-chevron-${showGigMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
            ></i>
          </div>

          {showGigMenu && (
            <div className="ml-6 mt-2">
              <Link
                to="/AdminManageJob"
                className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
                  location.pathname === '/AdminManageJob'
                    ? 'bg-gold shadow-md'
                    : 'hover:bg-gray-300'
                }`}
              >
                <i className="fas fa-briefcase text-base mr-2"></i>
                <span className="text-base font-bold">Manage Job Posts</span>
              </Link>

              <Link
                to="/AdminManageTutor"
                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
                  location.pathname === '/AdminManageTutor'
                    ? 'bg-gold shadow-md'
                    : 'hover:bg-gray-300'
                }`}
              >
                <i className="fas fa-chalkboard-teacher text-base mr-2"></i>
                <span className="text-base font-bold">Manage Tutor Posts</span>
              </Link>
            </div>
          )}
        </div>

        {/* Manage Job Posted Dismissal */}
        <Link
          to="/AdminJobDismissal"
          className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/AdminJobDismissal'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-users text-lg mr-2"></i>
          <span className="text-lg font-bold">Manage Job Posted Dismissal</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
