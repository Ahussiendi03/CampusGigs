import React from 'react';
import { Link } from 'react-router-dom';
import signUpImage from '../images/Login_Page_Website_UI_Prototype__7_-removebg-preview.png';

const EmployerRegisterSuccess = () => {
  return (
    <div className="flex">
      <div className="bg-gray-200 w-[330px] h-[550px] rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-8">
        <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
        <p className="text-lg font-medium ml-2">Upload Profile Picture</p>
        </div>
        <div className="flex items-center mb-8">
        <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
        <p className="text-lg font-medium mr-2 ml-2">Upload Business Permit</p>
        </div>
        <div className="flex items-center mb-8">
        <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Upload Valid ID</p>
        </div>
        <div className="flex items-center mb-8">
        <i className="fas fa-check-square text-green-500 text-3xl mr-2"></i>
          <p className="text-lg font-medium mr-2 ml-2">Campus Address</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="ml-4 text-center font-bold text-3xl text-maroon-700 bg-yellow-300 py-2 px-4 rounded w-[450px]">SUCCESSFULLY REGISTERED</h2>
     
        <div className="mt-3 flex justify-center items-center w-full px-4">
            <p>You are successfully registered you can now Sign In, <Link to="/sign-in" className="text-decoration: underline text-blue-500 font-semibold font-style: italic">Click here.</Link></p>
        </div>
      </div>

      <div className="w-[400px]  h-[550px] bg-maroon-700 p-6 flex items-center justify-center">
        <img src={signUpImage} className="w-full max-h-full lg:max-h-[500px]" />
      </div>
    </div>
  );
};

export default EmployerRegisterSuccess;