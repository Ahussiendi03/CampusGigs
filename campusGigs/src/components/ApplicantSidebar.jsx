import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplicantSidebar = () => {
  const location = useLocation();

  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const [showAccMenu, setShowAccMenu] = useState(false);
  const [showJobMenu, setShowJobMenu] = useState(false);

  useEffect(() => {
    const path = location.pathname + location.search;

    if (path.includes("ApplicantsJobPostings")) setJobDropdownOpen(true);
    else setJobDropdownOpen(false);

    if (path.includes("ApplicantsMyAcc") || path.includes("ApplicantsLevelingSystem"))
      setShowAccMenu(true);
    else setShowAccMenu(false);

    if (path.includes("ApplicantsJobApps") || path.includes("ApplicantsCurrentJob"))
      setShowJobMenu(true);
    else setShowJobMenu(false);
  }, [location.pathname, location.search]);

  return (
    <div className="bg-gray-200 w-[290px] min-h-full p-4 shadow-md flex flex-col">
      <Link
        to="/ApplicantDashboard"
        className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
          location.pathname === "/ApplicantDashboard"
            ? "bg-gold shadow-md"
            : "hover:bg-gray-300"
        }`}
      >
        <i className="fas fa-home text-lg mr-2"></i>
        <span className="text-lg font-bold">Dashboard</span>
      </Link>

      {/* Job Postings Dropdown */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
          onClick={() => setJobDropdownOpen(!jobDropdownOpen)}
        >
          <div className="flex items-center">
            <i className="fas fa-clipboard-list text-lg mr-2"></i>
            <span className="text-lg font-bold">Job Postings</span>
          </div>
          <i className={`fas fa-chevron-${jobDropdownOpen ? "up" : "down"}`}></i>
        </div>
        {jobDropdownOpen && (
          <div className="ml-6 mt-2 flex flex-col">
            <Link
              to="/ApplicantsJobPostings?view=job"
              className={`flex items-center mb-2 px-4 py-2 rounded hover:bg-yellow-300 ${
                location.pathname + location.search === "/ApplicantsJobPostings?view=job"
                  ? "bg-yellow-400 font-bold text-black"
                  : ""
              }`}
            >
              <i className="fas fa-briefcase text-base mr-2"></i>
              Job Post
            </Link>
            <Link
              to="/ApplicantsJobPostings?view=tutor"
              className={`flex items-center mb-2 px-4 py-2 rounded hover:bg-yellow-300 ${
                location.pathname + location.search === "/ApplicantsJobPostings?view=tutor"
                  ? "bg-yellow-400 font-bold text-black"
                  : ""
              }`}
            >
              <i className="fas fa-chalkboard-teacher text-base mr-2"></i>
              Tutor Post
            </Link>
          </div>
        )}
      </div>

      {/* My Account Dropdown */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
          onClick={() => setShowAccMenu(!showAccMenu)}
        >
          <div className="flex items-center">
            <i className="fas fa-user text-lg mr-2"></i>
            <span className="text-lg font-bold">My Account</span>
          </div>
          <i className={`fas fa-chevron-${showAccMenu ? "up" : "down"}`}></i>
        </div>
        {showAccMenu && (
          <div className="ml-6 mt-2 flex flex-col">
            <Link
              to="/ApplicantsMyAcc"
              className={`flex items-center mb-2 px-4 py-2 rounded hover:bg-gray-300 ${
                location.pathname === "/ApplicantsMyAcc" ? "bg-gold font-bold text-black" : ""
              }`}
            >
              <i className="fas fa-id-badge text-base mr-2"></i>
              Profile
            </Link>
            <Link
              to="/ApplicantsLevelingSystem"
              className={`flex items-center px-4 py-2 rounded hover:bg-gray-300 ${
                location.pathname === "/ApplicantsLevelingSystem"
                  ? "bg-gold font-bold text-black"
                  : ""
              }`}
            >
              <i className="fas fa-chart-line text-base mr-2"></i>
              Level
            </Link>
          </div>
        )}
      </div>

      {/* Job Status Dropdown */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
          onClick={() => setShowJobMenu(!showJobMenu)}
        >
          <div className="flex items-center">
            <i className="fas fa-briefcase text-lg mr-2"></i>
            <span className="text-lg font-bold">Job Status</span>
          </div>
          <i className={`fas fa-chevron-${showJobMenu ? "up" : "down"}`}></i>
        </div>
        {showJobMenu && (
          <div className="ml-6 mt-2 flex flex-col">
            <Link
              to="/ApplicantsJobApps"
              className={`flex items-center mb-2 px-4 py-2 rounded hover:bg-gray-300 ${
                location.pathname === "/ApplicantsJobApps" ? "bg-gold font-bold text-black" : ""
              }`}
            >
              <i className="fas fa-tasks text-base mr-2"></i>
              Applications
            </Link>
            <Link
              to="/ApplicantsCurrentJob"
              className={`flex items-center px-4 py-2 rounded hover:bg-gray-300 ${
                location.pathname === "/ApplicantsCurrentJob" ? "bg-gold font-bold text-black" : ""
              }`}
            >
              <i className="fas fa-briefcase text-base mr-2"></i>
              Current Job
            </Link>
          </div>
        )}
      </div>

      {/* Feedback */}
      <Link
        to="/ApplicantsFeedback"
        className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
          location.pathname === "/ApplicantsFeedback" ? "bg-gold shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <i className="fas fa-comments text-lg mr-2"></i>
        <span className="text-lg font-bold">Feedbacks</span>
      </Link>
    </div>
  );
};

export default ApplicantSidebar;
