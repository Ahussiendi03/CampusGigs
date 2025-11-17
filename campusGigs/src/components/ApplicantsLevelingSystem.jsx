import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ApplicantSidebar from "./ApplicantSidebar";
import Cookies from "js-cookie";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplicantsLevelingSystem = () => {
  const XP_PER_LEVEL = 100;
  const location = useLocation();

  const [experience, setExperience] = useState(0);
  const [rank, setRank] = useState("Beginner");
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showAccMenu, setShowAccMenu] = useState(true);
  const [showJobMenu, setShowJobMenu] = useState(false);

  useEffect(() => {
    const fetchApplicantInfo = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "http://localhost:5000/api/applicants/me",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { experience, rank, jobsCompleted, feedbackCount } =
          response.data;
        setExperience(experience);
        setRank(rank);
        setJobsCompleted(jobsCompleted);
        setFeedbackCount(feedbackCount);

        const levelValue = Math.floor(experience / XP_PER_LEVEL) + 1;
        const xpForCurrentLevel = experience % XP_PER_LEVEL;
        const progressPercent = Math.floor(
          (xpForCurrentLevel / XP_PER_LEVEL) * 100
        );

        setLevel(levelValue);
        setProgress(progressPercent);
      } catch (error) {
        console.error(
          "Error fetching applicant info:",
          error.response?.data || error.message
        );
      }
    };

    fetchApplicantInfo();
  }, []);

  const badges = {
    beginner: jobsCompleted >= 1,
    intermediate: jobsCompleted >= 5,
    expert: jobsCompleted >= 10,
  };

  const nextBadgeText =
    jobsCompleted < 5
      ? `${5 - jobsCompleted} more job(s) to reach Intermediate Badge`
      : jobsCompleted < 10
      ? `${10 - jobsCompleted} more job(s) to reach Expert Badge`
      : "You’ve unlocked all badges!";

  const sidebarItems = [
    { path: "/ApplicantDashboard", icon: "fa-home", label: "Dashboard" },
    {
      path: "/ApplicantsJobPostings",
      icon: "fa-clipboard-list",
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Job Postings</span>
          <i className="fas fa-chevron-down text-base ml-20 text-gray-600"></i>
        </div>
      ),
    },

    { path: "/ApplicantsMyAcc", icon: "fa-user", label: "My Account" },
    { path: "/ApplicantsJobApps", icon: "fa-users", label: "Job Applications" },
    { path: "/ApplicantsCurrentJob", icon: "fa-users", label: "Current Job" },
    { path: "/ApplicantsLevelingSystem", icon: "fa-briefcase", label: "Level" },
    { path: "/ApplicantsFeedback", icon: "fa-comments", label: "Feedbacks" },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      {/* Sidebar */}
      <ApplicantSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-maroon-700">
            Level {level}
          </h2>
          <p className="text-lg font-semibold text-black">
            Experience: {experience} XP
          </p>
          <p className="text-lg font-semibold text-gray-700">Rank: {rank}</p>
          <p className="text-gray-600 text-sm mt-2 italic">{nextBadgeText}</p>
        </div>

        {/* Badges */}
        <div className="mb-10 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Badges</h3>
          <div className="flex gap-6 justify-center">
            <div
              title="Complete 1 job to unlock"
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition ${
                badges.beginner ? "bg-yellow-400" : "bg-gray-400"
              }`}
            >
              <i className="fas fa-star text-2xl text-white"></i>
            </div>
            <div
              title="Complete 5 jobs to unlock"
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition ${
                badges.intermediate ? "bg-orange-400" : "bg-gray-400"
              }`}
            >
              <i className="fas fa-medal text-2xl text-white"></i>
            </div>
            <div
              title="Complete 10 jobs to unlock"
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition ${
                badges.expert ? "bg-red-500" : "bg-gray-400"
              }`}
            >
              <i className="fas fa-crown text-2xl text-white"></i>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[600px] bg-white rounded-xl border-2 border-yellow-600 shadow-xl p-8 mb-8 relative overflow-hidden">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Progress to Next Level
          </h3>
          <div className="w-full h-6 bg-gray-300 rounded-full relative">
            <div
              className="bg-maroon-700 h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
            {[25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                className="absolute top-0 h-6 w-1 bg-white"
                style={{ left: `${milestone}%`, transform: "translateX(-50%)" }}
              ></div>
            ))}
          </div>
          <p className="text-lg mt-2 text-gray-800">
            {progress}% to next level
          </p>
          <div className="absolute top-0 right-0 bg-maroon-700 text-white p-2 rounded-bl-xl shadow-lg text-sm font-bold">
            Next Level!
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row justify-around w-full gap-6 mb-10">
          {/* Feedback */}
          <div className="flex-1 bg-white border-2 border-maroon-700 rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Feedback Received
            </h3>
            <p className="text-2xl font-bold text-black mt-2">
              {feedbackCount}
            </p>
            <Link
              to="/ApplicantsFeedback"
              className="bg-maroon-700 hover:bg-black text-white font-bold py-2 px-4 rounded-lg mt-4 inline-block"
            >
              View Feedback
            </Link>
          </div>

          {/* Jobs Completed */}
          <div className="flex-1 bg-white border-2 border-maroon-700 rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Jobs Completed
            </h3>
            <p className="text-2xl font-bold text-black mt-2">
              {jobsCompleted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsLevelingSystem;
