import React from 'react';
import { Link } from 'react-router-dom';
import employerImage from '../images/Login_Page_Website_UI_Prototype__1_-removebg-preview.png';
import parentImage from '../images/Login_Page_Website_UI_Prototype__2_-removebg-preview.png';
import applicantImage from '../images/Login_Page_Website_UI_Prototype__3_-removebg-preview.png';

const SignUp = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Employer Section */}
        <div className="column">
          <div className="bg-white rounded-lg shadow-md p-4 mt-14">
            <h2 className="text-xl font-bold mb-2">Employer</h2>
            <img src={employerImage} alt="Employer" className="w-full rounded-lg mb-2 employeerPic" />
            <Link to="/employerSignUp" className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold rounded-lg text-center EmployeerSignIn">
              I WANT TO HIRE
            </Link>
          </div>
        </div>

        {/* Parent Section */}
        <div className="column">
          <div className="bg-white rounded-lg shadow-md p-4 mt-14">
            <h2 className="text-xl font-bold mb-2">Parent</h2>
            <img src={parentImage} alt="Parent" className="w-full rounded-lg mb-2 ParentPic" />
            <Link to="/parentSignUp" className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold rounded-lg text-center ParentSignIn">
              I WANT TO HIRE A TUTOR
            </Link>
          </div>
        </div>

        {/* Applicants Section */}
        <div className="column">
          <div className="bg-white rounded-lg shadow-md p-4 mt-14">
            <h2 className="text-xl font-bold mb-2">Applicants</h2>
            <img src={applicantImage} alt="Applicants" className="w-full rounded-lg mb-2 ApplicantPic" />
            <Link to="/applicantSignUp" className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold rounded-lg text-center ApplicantSignIn">
              I WANT A JOB
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
