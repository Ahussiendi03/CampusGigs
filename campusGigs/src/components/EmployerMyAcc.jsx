import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployerMyAcc = () => {
  const [employerData, setEmployerData] = useState(null);
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
    // Fetching data from the API endpoint
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
  
    }, 
    
  []);

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
        console.log('Update successful:', response.data);
        setEmployerData(response.data); // Update local state with the response
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
      <div className="bg-gray-200 w-[300px] h-[950px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
          <i className="fas fa-home text-lg mr-2"></i>
          <Link to="/EmployerDb" className="text-lg font-medium mr-2 ml-2">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-user text-lg mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">My Account</p>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to="/EmployerStaffs" className="text-lg font-medium mr-2 ml-2">
            Current Hired Staffs
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-users text-lg mr-2"></i>
          <Link to="/EmployerAppList" className="text-lg font-medium mr-2 ml-2">
            Applicant List
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-briefcase text-lg mr-2"></i>
          <Link to="/EmployerJobPost" className="text-lg font-medium mr-2 ml-2">
            Post Job
          </Link>
        </div>
        <div className="flex items-center mb-8">
          <i className="fas fa-comments text-lg mr-2"></i>
          <p className="text-lg font-medium ml-2">Feedbacks</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between mb-5 relative items-center">
          {/* Display Business Logo */}
          <div className="flex items-center">
            <img  
              src={`http://localhost:5000/${employerData.businessImage}`}
              alt="Business Logo"
              className="w-24 h-24 object-cover rounded-full mr-4"
            />
            <p className="bg-gray-200 text-center text-4xl font-bold mb-5 mt-3">
              MY ACCOUNT
            </p>
          </div>
          <div className="absolute right-0 top-0 flex flex-col items-end">
            {/* Display profile picture */}
            <img
              src={`http://localhost:5000/${employerData.profilePicture}`}
              alt="Profile"
              className="rounded-full mt-4 w-64 h-64 object-cover mb-6 mr-20"
            />
            <Link
              to=""
              className="mr-28 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[200px]"
            >
              Edit Profile Picture
            </Link>
          </div>
        </div>
        <div>
          {Object.keys(editMode).map((field) => (
            <div key={field} className="flex items-center mb-6 ml-7">
              <p className="text-1xl font-bold">
                {field.replace(/([A-Z])/g, ' $1').toUpperCase()}:
              </p>
              {editMode[field] ? (
                <>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="ml-2 text-lg border p-1 rounded"
                  />
                  <button
                    className="ml-2 text-black hover:text-gray-800"
                    onClick={handleSaveClick}
                  >
                    <i className="fas fa-save"></i>
                  </button>
                  <button
                    className="ml-2 text-black hover:text-gray-800"
                    onClick={handleCancelClick}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg ml-2">{employerData[field]}</p>
                  <button
                    className="ml-2 text-black hover:text-gray-800"
                    onClick={() => handleEditClick(field)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </>
              )}
            </div>
          ))}
          <p className="ml-7 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg text-center w-[220px]">
            Update Business Permit
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerMyAcc;
