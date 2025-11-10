import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminDashboard = () => {
  const location = useLocation();

  // State to hold fetched data
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingJobPosts, setPendingJobPosts] = useState([]);
  const [pendingTutorPosts, setPendingTutorPosts] = useState([]);
  const [showGigMenu, setShowGigMenu] = useState(false);

  useEffect(() => {
    // Fetch pending user registrations
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/pending"
        );
        setPendingUsers(response.data);
      } catch (error) {
        console.error("Error fetching pending users:", error);
      }
    };

    // Fetch pending job posts
    const fetchPendingJobPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/jobPosts/pending"
        );
        setPendingJobPosts(response.data);
      } catch (error) {
        console.error("Error fetching pending job posts:", error);
      }
    };

    // Fetch pending tutor posts
    const fetchPendingTutorPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tutorPosts/pending"
        );
        setPendingTutorPosts(response.data);
      } catch (error) {
        console.error("Error fetching pending tutor posts:", error);
      }
    };

    fetchPendingUsers();
    fetchPendingJobPosts();
    fetchPendingTutorPosts();
  }, []);

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center mb-48 p-4">
        <div className="flex justify-between items-center w-full mb-6">
          <p className="text-2xl font-bold">
            Hello, Welcome to MSU CampusGigs!
          </p>
        </div>

        {/* Summary Boxes */}
        <div className="flex justify-start mb-8 w-full space-x-16 px-2">
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-users text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">
                Pending Account Register
              </p>
              <p className="text-3xl font-extrabold">{pendingUsers.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-briefcase text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">
                Pending Jobs Posted
              </p>
              <p className="text-3xl font-extrabold">
                {pendingJobPosts.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-user-check text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">
                Pending Tutor Post
              </p>
              <p className="text-3xl font-extrabold">
                {pendingTutorPosts.length}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Account Registration List */}
        <div className="mt-6 w-full max-w-[1000px]">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-xl font-bold">
              Pending Account Registration List
            </p>
            <Link
              to="/AdminManageRegister"
              className="text-black underline mr-4 mt-1 text-lg font-semibold"
            >
              View All
            </Link>
          </div>

          {pendingUsers.length === 0 ? (
            <p>No pending user registrations.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-yellow-300">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">
                    Account Type
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    First Name
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Last Name
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Contact Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id} className="border border-gray-300">
                    <td className="border border-gray-300 p-2">{user.role}</td>
                    <td className="border border-gray-300 p-2">
                      {user.firstName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.lastName}
                    </td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">
                      {user.contactNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pending Job Posts */}
          <div className="mt-12 w-full flex justify-between items-center mb-3">
            <p className="text-xl font-bold">Pending Job Posts</p>
            <Link
              to="/AdminManageJob"
              className="text-black underline mr-4 mt-1 text-lg font-semibold"
            >
              View All
            </Link>
          </div>

          {pendingJobPosts.length === 0 ? (
            <p>No pending job posts.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-yellow-300">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">
                    Business Company
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Address
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Job Position
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Schedule
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingJobPosts.map((job) => (
                  <tr key={job._id} className="border border-gray-300">
                    <td className="px-4 py-2 flex items-center space-x-2">
                      {job.employerId?.businessImage && (
                        <img
                          src={`http://localhost:5000/${job.employerId.businessImage}`}
                          alt="Business Logo"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span>{job.employerId?.businessName || "N/A"}</span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {job.address || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {job.position || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {job.schedule || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pending Tutor Posts */}
          <div className="mt-12 w-full flex justify-between items-center mb-3">
            <p className="text-xl font-bold">Pending Tutor Posts</p>
            <Link
              to="/AdminManageJob"
              className="text-black underline mr-4 mt-1 text-lg font-semibold"
            >
              View All
            </Link>
          </div>

          {pendingTutorPosts.length === 0 ? (
            <p>No pending tutor posts.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-yellow-300">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">
                    Tutor Type
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Address
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Schedule
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingTutorPosts.map((tutor) => (
                  <tr key={tutor._id} className="border border-gray-300">
                    <td className="border border-gray-300 p-2">
                      {tutor.tutorType || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {tutor.address || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {tutor.schedule || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {tutor.salary || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
