import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import signUpImage from '../images/Login_Page_Website_UI_Prototype__7_-removebg-preview.png'; // Update path if necessary
import signUpImage2 from '../images/Login_Page_Website_UI_Prototype__8_-removebg-preview.png'; // Update path if necessary

const ApplicantSignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePicture: null,
    cor: null,
    schoolId: null,
    address: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handlePrev = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    axios.post('http://localhost:5000/applicantRegister', data)
      .then(res => {
        navigate('/sign-in');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 h-full max-h-full shadow-md w-full max-w-full">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Step 1: Personal Information</h2>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
              >
                Next
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex items-center justify-center">
              <div className="bg-gray-200 w-3/12 h-[550px] p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-8">
                  <input type="checkbox" className="checkbox w-6 h-6" disabled defaultChecked />
                  <p className="text-lg font-medium mr-2 ml-2">Upload Profile Picture</p>
                </div>
                <div className="flex items-center mb-8">
                  <input type="checkbox" className="checkbox w-6 h-6" disabled />
                  <p className="text-lg font-medium mr-2 ml-2">Upload Business Permit</p>
                </div>
                <div className="flex items-center mb-8">
                  <input type="checkbox" className="checkbox w-6 h-6" disabled />
                  <p className="text-lg font-medium mr-2 ml-2">Upload Valid ID</p>
                </div>
                <div className="flex items-center mb-8">
                  <input type="checkbox" className="checkbox w-6 h-6" disabled />
                  <p className="text-lg font-medium mr-2 ml-2">Campus Address</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mx-4">
                <h2 className="mb-6 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Upload Profile Picture</h2>
                <img src={signUpImage2} className="w-9/12 h-full mb-6" alt="Upload Profile" />
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  onChange={handleChange}
                  required
                />
                <div className="flex justify-end items-center w-full px-4 mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="mr-2 py-2 px-4 bg-gray-600 text-white font-bold text-lg rounded-lg"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="w-[400px] h-[550px] bg-maroon-700 rounded-sm shadow-md p-6 flex items-center">
                <img src={signUpImage} className="w-full max-h-full" alt="Sign Up" />
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Step 3: Upload Certificate of Registration</h2>
              <div className="mb-4">
                <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Certificate of Registration (COR)</label>
                <input
                  type="file"
                  id="cor"
                  name="cor"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
              >
                Next
              </button>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Step 4: Upload School ID</h2>
              <div className="mb-4">
                <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700">School ID</label>
                <input
                  type="file"
                  id="schoolId"
                  name="schoolId"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
              >
                Next
              </button>
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Step 5: Enter Address</h2>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Previous
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicantSignUp;
