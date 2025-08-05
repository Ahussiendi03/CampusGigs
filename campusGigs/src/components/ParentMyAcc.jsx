import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ParentMyAcc = () => {
  const [parentData, setParentData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    campusAddress: '',
    houseNumber: '',
    birthCertificate: '',
    profilePicture: ''
  });

  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showTutorMenu, setShowTutorMenu] = useState(false);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/parent/me', {
          withCredentials: true
        });
        setParentData(response.data);
      } catch (error) {
        console.error('Error fetching parent data:', error);
      }
    };

    fetchParentData();
  }, []);

  const handleEditClick = (field) => {
    setEditField(field);
    setInputValue(parentData[field]);
  };

  const handleSaveClick = async () => {
    try {
      const updatedData = { ...parentData, [editField]: inputValue };
      await axios.put('http://localhost:5000/api/parent/me', updatedData);
      setParentData(updatedData);
      setEditField(null);
    } catch (error) {
      console.error('Error updating parent data:', error);
    }
  };

  const handleCancelClick = () => {
    setEditField(null);
  };

  return (
    <div className="flex justify-center relative">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
  <Link
    to="/ParentDashboard"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentDashboard'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  <Link
    to="/ParentMyAcc"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentMyAcc'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-user text-lg mr-2"></i>
    <span className="text-lg font-bold">My Account</span>
  </Link>

  {/* Dropdown for Tutors */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowTutorMenu(!showTutorMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-users text-lg mr-2"></i>
        <span className="text-lg font-bold">Tutors</span>
      </div>
      <i
        className={`fas fa-chevron-${showTutorMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showTutorMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ParentTutors"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ParentTutors'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-check text-base mr-2"></i>
          <span className="text-base font-bold">Current Hired Tutors</span>
        </Link>

        <Link
          to="/ParentAppList"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ParentAppList'
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

  <Link
    to="/ParentPostTutor"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentPostTutor'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-briefcase text-lg mr-2"></i>
    <span className="text-lg font-bold">Post Tutor</span>
  </Link>

  <Link
    to="/ParentFeedback"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentFeedback'
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
            src={`http://localhost:5000/${parentData.profilePicture}`}
            alt="Profile"
            className="w-20 h-20 object-cover rounded-full mr-4 border"
          />
          My Account
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Personal Info Grid */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Personal Information</h3>
            {['firstName', 'lastName', 'contactNumber', 'campusAddress', 'houseNumber'].map((field) => (
              <div key={field} className="mb-5">
                <label className="block font-medium text-gray-700 mb-1 uppercase">
                  {field.replace(/([A-Z])/g, ' $1')}:
                </label>
                {editField === field ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                    />
                    <button onClick={handleSaveClick} className="text-green-600 hover:text-green-800">
                      <i className="fas fa-check"></i>
                    </button>
                    <button onClick={handleCancelClick} className="text-red-600 hover:text-red-800">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{parentData[field] || 'N/A'}</span>
                    <button onClick={() => handleEditClick(field)} className="text-gray-700 hover:text-black">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Uploaded Documents Grid */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Uploaded Documents</h3>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Birth Certificate:</label>
              {parentData.birthCertificate ? (
                <img
                  src={`http://localhost:5000/${parentData.birthCertificate}`}
                  alt="Birth Certificate"
                  className="w-48 h-48 object-cover border rounded"
                />
              ) : (
                <p className="text-gray-500 italic">No birth certificate uploaded.</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Profile Picture:</label>
              <img
                src={`http://localhost:5000/${parentData.profilePicture}`}
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

export default ParentMyAcc;
