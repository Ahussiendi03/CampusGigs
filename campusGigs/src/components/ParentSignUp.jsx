import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ParentSignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePicture: null,
    id: null,
    birthCertificate: null,
    campusAddress: ''
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

    axios.post('http://localhost:5000/parentRegister', data)
      .then(res => {
        navigate('/sign-in');
      }).catch(err => console.log(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Parent Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-2"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <div className="mb-4">
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">Upload Valid ID</label>
                <input
                  type="file"
                  id="id"
                  name="id"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-2"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <div className="mb-4">
                <label htmlFor="birthCertificate" className="block text-sm font-medium text-gray-700">Upload Birth Certificate</label>
                <input
                  type="file"
                  id="birthCertificate"
                  name="birthCertificate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-2"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </>
          )}
          {step === 5 && (
            <>
              <div className="mb-4">
                <label htmlFor="campusAddress" className="block text-sm font-medium text-gray-700">Campus Address</label>
                <input
                  type="text"
                  id="campusAddress"
                  name="campusAddress"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.campusAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-2"
              >
                Previous
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ParentSignUp;
