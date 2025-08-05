import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerMyAcc = () => {
  const [employerData, setEmployerData] = useState(null);
  const [showApplicantMenu, setShowApplicantMenu] = useState(false);
  const [editMode, setEditMode] = useState({
    businessName: false,
    firstName: false,
    lastName: false,
    contactNumber: false,
    streetAddress: false,
  });

  const [formData, setFormData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    streetAddress: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/employer/me', { withCredentials: true })
      .then((response) => {
        setEmployerData(response.data);
        setFormData({
          businessName: response.data.businessName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          contactNumber: response.data.contactNumber,
          streetAddress: response.data.streetAddress,
        });
      })
      .catch((error) => {
        console.error('Error fetching employer data:', error);
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
    axios
      .put('http://localhost:5000/api/employer/update', formData, {
        withCredentials: true,
      })
      .then((response) => {
        setEmployerData(response.data);
        setEditMode({
          businessName: false,
          firstName: false,
          lastName: false,
          contactNumber: false,
          streetAddress: false,
        });
      })
      .catch((error) => {
        console.error('Error updating employer data:', error);
      });
  };

  const handleCancelClick = () => {
    setFormData({
      businessName: employerData.businessName,
      firstName: employerData.firstName,
      lastName: employerData.lastName,
      contactNumber: employerData.contactNumber,
      streetAddress: employerData.streetAddress,
    });
    setEditMode({
      businessName: false,
      firstName: false,
      lastName: false,
      contactNumber: false,
      streetAddress: false,
    });
  };

  if (!employerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center relative">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
  {/* Dashboard */}
  <Link
    to="/EmployerDb"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerDb'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  {/* My Account */}
  <Link
    to="/EmployerMyAcc"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerMyAcc'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-user text-lg mr-2"></i>
    <span className="text-lg font-bold">My Account</span>
  </Link>

  {/* Applicants Dropdown */}
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
        className={`fas fa-chevron-${showApplicantMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {/* Dropdown Menu Items */}
    {showApplicantMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/EmployerStaffs"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/EmployerStaffs'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-check text-base mr-2"></i>
          <span className="text-base font-bold">Current Hired Staffs</span>
        </Link>

        <Link
          to="/EmployerAppList"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/EmployerAppList'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-clock text-base mr-2"></i>
          <span className="text-base font-bold">Applicant List</span>
        </Link>
      </div>
    )}
  </div>

  {/* Post Job */}
  <Link
    to="/EmployerJobPost"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerJobPost'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-briefcase text-lg mr-2"></i>
    <span className="text-lg font-bold">Post Job</span>
  </Link>

  {/* Feedbacks */}
  <Link
    to="/EmployerFeedbacks"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/EmployerFeedbacks'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-comments text-lg mr-2"></i>
    <span className="text-lg font-bold">Feedbacks</span>
  </Link>
</div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <img
            src={`http://localhost:5000/${employerData.businessImage}`}
            alt="Business Logo"
            className="w-20 h-20 object-cover rounded-full mr-4 border"
          />
          My Account
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Editable Information */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Business & Personal Info</h3>
            {Object.keys(editMode).map((field) => (
              <div key={field} className="mb-5">
                <label className="block font-medium text-gray-700 mb-1">
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
                    <span>{employerData[field]}</span>
                    <button onClick={() => handleEditClick(field)} className="text-gray-700 hover:text-black">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Uploaded Images */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Uploaded Images</h3>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Business Logo:</label>
              <img
                src={`http://localhost:5000/${employerData.businessImage}`}
                alt="Business Logo"
                className="w-48 h-48 object-cover border rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Profile Picture:</label>
              <img
                src={`http://localhost:5000/${employerData.profilePicture}`}
                alt="Profile"
                className="w-48 h-48 object-cover border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerMyAcc;
