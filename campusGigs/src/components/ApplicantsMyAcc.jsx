import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplicantMyAcc = () => {
  const [applicantData, setApplicantData] = useState(null);
  const [showAccMenu, setShowAccMenu] = useState(true);
const [showJobMenu, setShowJobMenu] = useState(false);
  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    email: false,
    streetAddress: false,
    schoolId: false,
    cor: false,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    streetAddress: '',
    schoolIdFile: null,
    corFile: null,
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/applicants/my', { withCredentials: true })
      .then((response) => {
        setApplicantData(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          streetAddress: response.data.streetAddress,
          schoolId: response.data.schoolId,
          cor: response.data.cor,
        });
      })
      .catch((error) => {
        console.error('Error fetching applicant data:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSaveClick = () => {
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('streetAddress', formData.streetAddress);

    if (formData.schoolIdFile) data.append('schoolId', formData.schoolIdFile);
    if (formData.corFile) data.append('cor', formData.corFile);

    axios
      .put('http://localhost:5000/api/applicants/update', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        setApplicantData(response.data);
        setEditMode({
          firstName: false,
          lastName: false,
          email: false,
          streetAddress: false,
          schoolId: false,
          cor: false,
        });
      })
      .catch((error) => {
        console.error('Error updating applicant data:', error);
      });
  };

  const handleCancelClick = () => {
    setFormData({
      firstName: applicantData.firstName,
      lastName: applicantData.lastName,
      email: applicantData.email,
      streetAddress: applicantData.streetAddress,
      schoolIdFile: null,
      corFile: null,
    });
    setEditMode({
      firstName: false,
      lastName: false,
      email: false,
      streetAddress: false,
      schoolId: false,
      cor: false,
    });
  };

  if (!applicantData) return <div>Loading...</div>;

  const sidebarItems = [
    { path: '/ApplicantDashboard', icon: 'fa-home', label: 'Dashboard' },
    {
      path: '/ApplicantsJobPostings',
      icon: 'fa-clipboard-list',
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Job Postings</span>
          <i className="fas fa-chevron-down text-base ml-20 text-gray-600"></i>
        </div>
      ),
    },
    { path: '/ApplicantsMyAcc', icon: 'fa-user', label: 'My Account' },
    { path: '/ApplicantsJobApps', icon: 'fa-users', label: 'Job Applications' },
    { path: '/ApplicantsCurrentJob', icon: 'fa-users', label: 'Current Job' },
    { path: '/ApplicantsLevelingSystem', icon: 'fa-briefcase', label: 'Level' },
    { path: '/ApplicantsFeedback', icon: 'fa-comments', label: 'Feedbacks' },
  ];

  return (
    <div className="flex justify-center relative">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-auto p-4 shadow-md">
  <Link
    to="/ApplicantDashboard"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ApplicantDashboard' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  <Link
    to="/ApplicantsJobPostings"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ApplicantsJobPostings' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-clipboard-list text-lg mr-2"></i>
    <span className="text-lg font-bold">Job Postings</span>
    <i className='fas fa-chevron-down text-base ml-20 text-gray-600'></i>
  </Link>

  {/* Dropdown: My Account */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowAccMenu(!showAccMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-user text-lg mr-2"></i>
        <span className="text-lg font-bold">My Account</span>
      </div>
      <i
        className={`fas fa-chevron-${showAccMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showAccMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ApplicantsMyAcc"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsMyAcc' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-id-badge text-base mr-2"></i>
          <span className="text-base font-bold">Profile</span>
        </Link>
        <Link
          to="/ApplicantsLevelingSystem"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsLevelingSystem' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-chart-line text-base mr-2"></i>
          <span className="text-base font-bold">Level</span>
        </Link>
      </div>
    )}
  </div>

  {/* Dropdown: Job Status */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowJobMenu(!showJobMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-briefcase text-lg mr-2"></i>
        <span className="text-lg font-bold">Job Status</span>
      </div>
      <i
        className={`fas fa-chevron-${showJobMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showJobMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ApplicantsJobApps"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsJobApps' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-tasks text-base mr-2"></i>
          <span className="text-base font-bold">Applications</span>
        </Link>
        <Link
          to="/ApplicantsCurrentJob"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ApplicantsCurrentJob' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-briefcase text-base mr-2"></i>
          <span className="text-base font-bold">Current Job</span>
        </Link>
      </div>
    )}
  </div>

  <Link
    to="/ApplicantsFeedback"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ApplicantsFeedback' ? 'bg-gold shadow-md' : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-comments text-lg mr-2"></i>
    <span className="text-lg font-bold">Feedbacks</span>
  </Link>
</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 bg-white">
        <div className="flex items-center mb-8">
          <img
            src={`http://localhost:5000/${applicantData.profilePicture}`}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full mr-4 border"
          />
          <h2 className="text-3xl font-bold">My Account</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">Personal Information</h3>
            {['firstName', 'lastName', 'email', 'streetAddress'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block font-semibold mb-1 text-gray-700">
                  {field.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                </label>
                {editMode[field] ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="border rounded px-3 py-1 w-full"
                    />
                    <button onClick={handleSaveClick} className="text-green-600 hover:text-green-800">
                      <i className="fas fa-save"></i>
                    </button>
                    <button onClick={handleCancelClick} className="text-red-600 hover:text-red-800">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{applicantData[field]}</span>
                    <button onClick={() => handleEditClick(field)} className="text-gray-700 hover:text-black">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Uploaded Documents */}
          <div>
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">Uploaded Documents</h3>

            {/* School ID */}
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">School ID:</label>
              <img
                src={
                  formData.schoolIdFile
                    ? URL.createObjectURL(formData.schoolIdFile)
                    : `http://localhost:5000/${applicantData.schoolId}`
                }
                alt="School ID"
                className="w-28 h-28 object-cover rounded border"
              />
              {editMode.schoolId ? (
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, schoolIdFile: e.target.files[0] })
                    }
                  />
                  <button onClick={handleSaveClick} className="text-green-600 hover:text-green-800">
                    <i className="fas fa-save"></i>
                  </button>
                  <button onClick={handleCancelClick} className="text-red-600 hover:text-red-800">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <button onClick={() => handleEditClick('schoolId')} className="mt-2 text-gray-700 hover:text-black">
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>

            {/* COR */}
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Certificate of Registration (COR):</label>
              <img
                src={
                  formData.corFile
                    ? URL.createObjectURL(formData.corFile)
                    : `http://localhost:5000/${applicantData.cor}`
                }
                alt="COR"
                className="w-28 h-28 object-cover rounded border"
              />
              {editMode.cor ? (
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, corFile: e.target.files[0] })
                    }
                  />
                  <button onClick={handleSaveClick} className="text-green-600 hover:text-green-800">
                    <i className="fas fa-save"></i>
                  </button>
                  <button onClick={handleCancelClick} className="text-red-600 hover:text-red-800">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <button onClick={() => handleEditClick('cor')} className="mt-2 text-gray-700 hover:text-black">
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantMyAcc;
