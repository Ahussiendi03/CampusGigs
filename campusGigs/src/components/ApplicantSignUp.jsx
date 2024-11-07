import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signUpImage from '../images/Login_Page_Website_UI_Prototype__3_-removebg-preview.png';
import signUpImage2 from '../images/Login_Page_Website_UI_Prototype__8_-removebg-preview.png';
import signUpImage3 from '../images/Login_Page_Website_UI_Prototype__7_-removebg-preview.png';

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
    streetAddress: ''
  });
  const [preview, setPreview] = useState({
    profilePicture: null,
    cor: null,
    schoolId: null
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData(prevState => ({
        ...prevState,
        [name]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(prevState => ({
          ...prevState,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const { firstName, lastName, email, password } = formData;
      if (!firstName || !lastName || !email || !password) {
        alert('Please fill out all the fields.');
        return;
      }
    }

    if (step === 2 && !formData.profilePicture) {
      alert('Please upload your profile picture.');
      return;
    }
  
    if (step === 4 && !formData.schoolId) {
      alert('Please upload your School ID.');
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

    axios.post('http://localhost:5000/applicantRegister', data)
      .then(res => {
        navigate('/sign-in');
      }).catch(err => console.log(err));
  };

  return (
    <div className="flex items-center justify-center">
      {step === 1 && (
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <img src={signUpImage} alt="Sign Up" className="ml-32 mb-20 w-1/2 h-auto lg:mb-0 lg:mr-10" />
          <div className="ml-28 bg-maroon-700 rounded-lg shadow-md p-6 w-full flex items-center" style={{ height: '550px', width: '550px'}}>
            <div className="w-full mt-0">
              <h2 className="text-3xl font-bold text-yellow-400 mt-6 text-center">APPLICANT</h2>
              <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">REGISTRATION</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-yellow-400 text-sm mb-2">FIRST NAME:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full p-3 bg-yellow-300 text-maroon-700 border-0 rounded-lg text-sm"
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
                    className="w-full p-3 bg-yellow-300 text-maroon-700 border-0 rounded-lg text-sm"
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
                    className="w-full p-3 bg-yellow-300 text-maroon-700 border-0 rounded-lg text-sm"
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
                    className="w-full p-3 bg-yellow-300 text-maroon-700 border-0 rounded-lg text-sm"
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
          <p className="text-lg font-medium mr-2 ml-2">Upload COR</p>
          </div>
          <div className="flex items-center mb-8">
          <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Upload School ID</p>
          </div>
          <div className="flex items-center mb-8">
          <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
          </div>
        </div>
      
        <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="mb-6 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Applicant Profile</h2>
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
              <p className="text-lg font-medium mr-2 ml-2">Upload COR</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload School ID</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="mb-6 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Applicant Profile</h2>
          <img src={preview.cor || signUpImage2} alt="Profile Preview" className="rounded-full w-80 h-72 mb-6 ml-5 object-cover" />
          <label htmlFor="cor" className="cursor-pointer mb-5 ml-5 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center max-w-[310px]">
            + Add Certificate of Registration
            <input
              type="file"
              id="cor"
              name="cor"
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
              <p className="text-lg font-medium mr-2 ml-2">Upload COR</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload School ID</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
            </div>
          </div>

        <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="mb-6 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Applicant Profile</h2>
            <img src={preview.schoolId || signUpImage2} alt="Valid ID Preview" className="rounded-full w-80 h-72 mb-6 ml-5 object-cover" />
            <label htmlFor="schoolId" className="cursor-pointer mb-5 ml-5 block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-lg rounded-lg text-center max-w-[230px]">
              + Add School ID
              <input
                type="file"
                id="schoolId"
                name="schoolId"
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
              <p className="text-lg font-medium mr-2 ml-2">Upload COR</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Upload School ID</p>
            </div>
            <div className="flex items-center mb-8">
            <i className="fas fa-check-square text-gray-400 text-3xl mr-2"></i>
              <p className="text-lg font-medium mr-2 ml-2">Other Informations</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="mb-20 ml-4 text-center font-bold text-2xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[300px]">Applicant Profile</h2>
            <div className="mb-36 mr-40">     
            <p className="text-lg font-medium mr-2 mb-1">Type your Contact Number:</p>
            <input
              type="text"
              className="mb-4 font-semi text-1xl py-2 px-4 border border-black rounded-lg w-[300px]"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter Contact Number"
            />
      
            <p className="text-lg font-medium mr-2 mb-1">Select your Campus Address:</p>
            <select
              className="mb-4 font-semi text-1xl py-2 px-4 border border-black rounded-lg w-[300px]"
              name="streetAddress"
              value={formData.streetAddress}
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
  );
};

export default ApplicantSignUp;