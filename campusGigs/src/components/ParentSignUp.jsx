import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signUpImage from '../images/Login_Page_Website_UI_Prototype__2_-removebg-preview.png';
import signUpImage2 from '../images/Login_Page_Website_UI_Prototype__8_-removebg-preview.png';
import signUpImage3 from '../images/Login_Page_Website_UI_Prototype__7_-removebg-preview.png';

const ParentSignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePicture: null,
    birthCertificate: null,
    id: null,
    campusAddress: '',
    houseNumber: '',
    contactNumber: ''
  });
  const [preview, setPreview] = useState({
    profilePicture: null,
    birthCertificate: null,
    id: null
  });
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const showError = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'firstName' || name === 'lastName') {
      const lettersOnly = value.replace(/[0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: lettersOnly }));
      return;
    }

    if (files) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const { firstName, lastName, email, password } = formData;
      if (!firstName || !lastName || !email || !password) {
        showError('Please fill out all the fields.');
        return;
      }
    }
    if (step === 2 && !formData.profilePicture) {
      showError('Please upload your profile picture.');
      return;
    }
    if (step === 3 && !formData.birthCertificate) {
      showError('Please upload your child\'s birth certificate.');
      return;
    }
    if (step === 4 && !formData.id) {
      showError('Please upload your valid ID.');
      return;
    }
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
        console.log('Success:', res.data);
        setShowSuccessModal(true);
  
        // Auto-navigate to sign-in after 3 seconds
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      })
      .catch(err => {
        console.error('Error:', err.response ? err.response.data : err.message);
        showError('Registration failed. Please try again.');
      });
  };
  

  return (
    <>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Notice</h3>
            <p className="text-gray-700 mb-6">{modalMessage}</p>
            <button
              className="px-4 py-2 bg-maroon-700 text-yellow-300 rounded hover:bg-maroon-800"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showSuccessModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
      <div className="mb-4">
        <i className="fas fa-check-circle text-green-500 text-5xl"></i>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Registered</h2>
      <p className="text-gray-700 mb-4">
        Your account has been successfully registered.<br />
        Please wait for the admin approval.
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Redirecting to sign in...
      </p>
      <button
        onClick={() => navigate('/sign-in')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition duration-300"
      >
        Close
      </button>
    </div>
  </div>
)}


      {/* Your existing JSX starts here */}
      <div className="flex items-center justify-center">
      {step === 1 && (
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <img src={signUpImage} alt="Sign Up" className="ml-32 mb-20 w-1/2 h-auto lg:mb-0 lg:mr-10" />
          <div className="ml-28 bg-maroon-700 rounded-lg shadow-md p-6 w-full flex items-center" style={{ height: '550px', width: '550px'}}>
            <div className="w-full mt-0">
              <h2 className="text-3xl font-bold text-yellow-400 mt-6 text-center">PARENT</h2>
              <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">REGISTRATION</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-yellow-400 text-sm mb-2">FIRST NAME:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full p-3 bg-white border-0 rounded-lg text-sm"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-yellow-400 text-sm mb-2">LAST NAME:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full p-3 bg-white  border-0 rounded-lg text-sm"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-yellow-400 text-sm mb-2">EMAIL:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 bg-white  border-0 rounded-lg text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-yellow-400 text-sm mb-2">PASSWORD:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 bg-white  border-0 rounded-lg text-sm"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>        
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-yellow-300 text-maroon-700 font-bold rounded-md text-base"
                  >
                    Next
      

                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flex justify-between items-center min-w-full">
        <div className="bg-gray-200 w-3/12 h-[550px] p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-8">
          <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Upload Profile Picture</p>
          </div>
          <div className="flex items-center mb-8">
          <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Upload Birth Cetificate of the Child</p>
          </div>
          <div className="flex items-center mb-8">
          <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Upload Valid ID</p>
          </div>
          <div className="flex items-center mb-8">
          <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
          </div>
        </div>
      
        <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="mb-6 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Parent Profile</h2>
          <img src={preview.profilePicture || signUpImage2} alt="Profile Preview" className="rounded-full w-80 h-72 mb-6 ml-5 object-cover" />
          <label htmlFor="profilePicture" className="cursor-pointer mb-5 ml-5 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center max-w-[230px]">
            + Add Profile Picture
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              className="hidden"
              onChange={handleChange}
              required
            />
          </label>
          <div className="flex justify-end items-center w-full px-4">
          <button
              type="button"
              onClick={handleNext}
              className="float-right mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[80px]"
           >
              Next
            </button>
          </div>
        </div>
      
        <div className="w-[400px] h-[550px] bg-maroon-700 rounded-sm shadow-md p-6 flex items-center">
          <img src={signUpImage3} className="w-full max-h-full lg:max-h-[500px]" />
        </div>
      </div>
      
      )}
      {step === 3 && (
        <div className="flex justify-between items-center min-w-full">
          <div className="bg-gray-200 w-3/12 h-[550px] p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload Profile Picture</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload Birth Cetificate of the Child</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload Valid ID</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="mb-6 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Parent Profile</h2>
          <img src={preview.birthCertificate || signUpImage2} alt="Birth Certificate Preview" className="rounded-full w-80 h-72 mb-6 ml-5 object-cover" />
          <label htmlFor="birthCertificate" className="cursor-pointer mb-5 ml-5 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center max-w-[330px]">
            + Add Birth Certificate of the Child
            <input
              type="file"
              id="birthCertificate"
              name="birthCertificate"
              className="hidden"
              onChange={handleChange}
              required
            />
          </label>
            <div className="flex justify-between items-center w-full px-4">
            <button
                type="button"
                onClick={handlePrev}
                className="mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[80px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[80px]"
              >
                Next
              </button>
              </div>
          </div>

          <div className="w-[400px] h-[550px] bg-maroon-700 rounded-sm shadow-md p-6 flex items-center">
            <img src={signUpImage3} className="w-full max-h-full lg:max-h-[500px]" />
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="flex justify-between items-center min-w-full">
          <div className="bg-gray-200 w-3/12 h-[550px] p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload Profile Picture</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload Birth Cetificate of the Child</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload Valid ID</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
            </div>
          </div>

        <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="mb-6 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Parent Profile</h2>
            <img src={preview.id || signUpImage2} alt="Valid ID Preview" className="rounded-full w-80 h-72 mb-6 ml-5 object-cover" />
            <label htmlFor="id" className="cursor-pointer mb-5 ml-5 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center max-w-[230px]">
              + Add Valid ID
              <input
                type="file"
                id="id"
                name="id"
                className="hidden"
                onChange={handleChange}  
                required
              />
            </label>
            <div className="flex justify-between items-center w-full px-4">
            <button
                type="button"
                onClick={handlePrev}
                className="mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[80px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[80px]"
              >
                Next
              </button>
              </div>
          </div>

          <div className="w-[400px] h-[550px] bg-maroon-700 rounded-sm shadow-md p-6 flex items-center">
            <img src={signUpImage3} className="w-full max-h-full lg:max-h-[500px]" />
          </div>
        </div>
      )}
     {step === 5 && (
        <div className="flex items-center min-w-full">
        <div className="bg-gray-200 w-3/12 h-[550px] p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
            <p className="text-lg font-medium mr-2 ml-2">Upload Profile Picture</p>
          </div>
          <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
            <p className="text-lg font-medium mr-2 ml-2">Upload Birth Cetificate of the Child</p>
          </div>
          <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
            <p className="text-lg font-medium mr-2 ml-2">Upload Valid ID</p>
          </div>
          <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
            <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
          </div>
        </div>
      
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="mb-12 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">
            Parent Profile
          </h2>
          <div className="mb-20 mr-40">
            <p className="text-lg font-medium mr-2 mb-1">Enter your House Number:</p>
            <input
              type="number"
              className="mb-4 font-semi text-1xl py-2 px-4 border border-black rounded-lg w-[300px]"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              placeholder="Enter House Number"
              min="0"
              step="1"
              required
            />
            
            <p className="text-lg font-medium mr-2 mb-1">Enter your Contact Number:</p>
            <input
              type="number"
              className="mb-4 font-semi text-1xl py-2 px-4 border border-black rounded-lg w-[300px]"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter Contact Number"
              min="0"
              step="1"
              required
            />
      
            <p className="text-lg font-medium mr-2 mb-1">Select your Campus Address:</p>
            <select
              className="mb-4 font-semi text-1xl py-2 px-4 border border-black rounded-lg w-[300px]"
              name="campusAddress"
              value={formData.campusAddress}
              onChange={handleChange}
            >
              <option value="">Select Address/Street</option>
              <option value="Dimalna 2">Dimalna 2</option>
              <option value="Barrio Salam">Barrio Salam</option>
              <option value="3rd Street">3rd Street</option>
              {/* Add more options as needed */}
            </select>
          </div>
      
          <div className="flex justify-between items-center w-full px-4">
            <button
              type="button"
              onClick={handlePrev}
              className="mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[80px]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-3 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center w-[100px]"
            >
              Submit
            </button>
          </div>
        </div>
      
        <div className="w-[400px] h-[550px] bg-maroon-700 p-6 flex items-center justify-center">
          <img src={signUpImage3} className="w-full max-h-full lg:max-h-[500px]" />
        </div>
      </div>
      )}
           
    </div>
    </>
  );
};

export default ParentSignUp;
