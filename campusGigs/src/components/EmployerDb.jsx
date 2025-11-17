import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Bell } from "lucide-react";

const EmployerDb = () => {
  const navigate = useNavigate();
  const [showApplicantMenu, setShowApplicantMenu] = useState(false);
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [employerData, setEmployerData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const employerId = localStorage.getItem("employerId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingRes = await axios.get(
          `http://localhost:5000/api/applications/pending-applicants/${employerId}`
        );
        setPendingApplicants(pendingRes.data);

        const approvedRes = await axios.get(
          `http://localhost:5000/api/applications/approved-applicants/${employerId}`
        );
        setApprovedApplicants(approvedRes.data);

        const jobRes = await axios.get(
          "http://localhost:5000/api/jobposts/employer",
          {
            params: { employerId, status: "approved" },
          }
        );
        setJobPosts(jobRes.data);

        // 🔹 Changed this part to use /me
        const employerRes = await axios.get(
          "http://localhost:5000/api/employer/me",
          { withCredentials: true }
        );
        setEmployerData(employerRes.data);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    };

    if (employerId) {
      fetchData();
    }
  }, [employerId]);

  let statusMessage = "";
  if (employerData?.status === "rejected") {
    statusMessage = "Sorry, your account was rejected.";
  } else if (employerData?.status !== "approved") {
    statusMessage = "Your account is not approved yet.";
  } else {
    statusMessage = "Your account is approved!";
  }

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <EmployerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start mb-48 p-8 max-w-[1100px]">
        <div className="flex justify-between items-center w-full mb-6">

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-96 transform transition-all scale-100 animate-fadeIn">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl px-5 py-4 flex items-center space-x-3">
                  <span className="text-2xl">
                    {employerData?.status === "approved" && "✅"}
                    {employerData?.status === "rejected" && "❌"}
                    {employerData?.status !== "approved" &&
                      employerData?.status !== "rejected" &&
                      "⚠️"}
                  </span>
                  <h2 className="text-white text-lg font-semibold">
                    Account Status
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Show rejection reason if rejected */}
                  {employerData?.status === "rejected" ? (
                    <>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Your account has been{" "}
                        <span className="font-semibold text-red-500">
                          rejected
                        </span>
                        .
                      </p>

                      {/* Rejection reason */}
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">Reason:</span>{" "}
                          {employerData?.rejectionReason ||
                            "No reason provided."}
                        </p>
                      </div>

                      <p className="text-sm text-gray-500 italic animate-pulse">
                        Please review the reason and try registering again.
                      </p>
                    </>
                  ) : employerData?.status !== "approved" ? (
                    <>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Please contact us at the email below so that we can
                        notify you if your account is approved.
                      </p>

                      {/* Contact us section */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-full">📩</div>
                        <div>
                          <p className="text-sm text-gray-700">Email us:</p>
                          <a
                            href="mailto:support@campusgigs.com"
                            className="text-blue-600 font-medium hover:underline"
                          >
                            support@campusgigs.com
                          </a>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 italic animate-pulse">
                        Stay tuned — we’ll keep you posted!
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {statusMessage}
                    </p>
                  )}

                  {/* Close Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-start mb-8 w-full space-x-16 px-2">
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-users text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">Applicants</p>
              <p className="text-3xl font-extrabold">
                {pendingApplicants.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-briefcase text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">Jobs Posted</p>
              <p className="text-3xl font-extrabold">{jobPosts.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-yellow-100 rounded-lg px-6 py-4 shadow-md">
            <i className="fas fa-user-check text-maroon-700 text-6xl"></i>
            <div>
              <p className="text-lg font-medium text-maroon-700">
                Current Staffs
              </p>
              <p className="text-3xl font-extrabold">
                {approvedApplicants.length}
              </p>
            </div>
          </div>
        </div>

        {/* Current Hired Staffs Table */}
        <section className="mb-12 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              My Team (Current Hired Staffs)
            </h2>
            <Link
              to="/EmployerStaffs"
              className="text-yellow-600 underline font-semibold hover:text-yellow-800"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900">
                <tr>
                  <th className="text-left py-3 px-6">First Name</th>
                  <th className="text-left py-3 px-6">Last Name</th>
                  <th className="text-left py-3 px-6">Schedule</th>
                  <th className="text-left py-3 px-6">Job Position</th>
                  <th className="text-left py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedApplicants.map((staff, index) => {
                  const applicant = staff.applicantId;
                  const job = staff.jobId;

                  if (!applicant || !job) return null;

                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-yellow-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-6">{applicant.firstName}</td>
                      <td className="py-3 px-6">{applicant.lastName}</td>
                      <td className="py-3 px-6">{job.schedule}</td>
                      <td className="py-3 px-6">{job.position}</td>
                      <td className="py-3 px-6 text-green-600 font-semibold">
                        {staff.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Applicants List Table */}
        <section className="mb-12 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Applicants List
            </h2>
            <Link
              to="/EmployerAppList"
              className="text-yellow-600 underline font-semibold hover:text-yellow-800"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900">
                <tr>
                  <th className="text-left py-3 px-6">First Name</th>
                  <th className="text-left py-3 px-6">Last Name</th>
                  <th className="text-left py-3 px-6">Email</th>
                  <th className="text-left py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplicants.map((applicant, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-yellow-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-6">
                      {applicant.applicantId.firstName}
                    </td>
                    <td className="py-3 px-6">
                      {applicant.applicantId.lastName}
                    </td>
                    <td className="py-3 px-6">{applicant.applicantId.email}</td>
                    <td className="py-3 px-6 text-yellow-600 font-semibold">
                      {applicant.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Jobs Posted Table */}
        <section className="mb-12 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Jobs Posted</h2>
            <Link
              to="/EmployerJobPost"
              className="text-yellow-600 underline font-semibold hover:text-yellow-800"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-300 text-yellow-900">
                <tr>
                  <th className="text-left py-3 px-6">Job Position</th>
                  <th className="text-left py-3 px-6">Salary</th>
                  <th className="text-left py-3 px-6">Schedule</th>
                  <th className="text-left py-3 px-6">Quota</th>
                  <th className="text-left py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((job, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-yellow-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-6">{job.position}</td>
                    {job.salaryRate}/
                    {job.salaryRateType === "per day" ? "day" : "hour"}
                    <td className="py-3 px-6">{job.schedule}</td>
                    <td className="py-3 px-6">{job.quota}</td>
                    <td className="py-3 px-6 text-yellow-700 font-semibold">
                      {job.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployerDb;
