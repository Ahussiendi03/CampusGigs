import React from 'react';
import { Link } from 'react-router-dom';
import employerImage from '../images/Login_Page_Website_UI_Prototype__1_-removebg-preview.png';
import parentImage from '../images/Login_Page_Website_UI_Prototype__2_-removebg-preview.png';
import applicantImage from '../images/Login_Page_Website_UI_Prototype__3_-removebg-preview.png';

const SignUp = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main SignUp Content */}
      <main className="flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Employer Section */}
          <div className="column">
            <div className="bg-white rounded-lg shadow-md p-4 mt-14">
              <h2 className="text-xl font-bold mb-2">Employer</h2>
              <img src={employerImage} alt="Employer" className="w-full rounded-lg mb-2 employeerPic" />
              <Link to="/employerSignUp" className="block py-2 px-4 bg-maroon-700 text-yellow-300 font-bold rounded-lg text-center EmployeerSignIn">
                I WANT TO HIRE AN APPLICANT
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
                I WANT A PART TIME JOB
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-gold text-black py-6 text-center">
        <p className="text-sm">© 2025 MSU CampusGigs. All rights reserved.</p>
        <div className="flex justify-center mt-4">
          <a href="#about-us" className="mx-4 text-sm hover:underline">About Us</a>
          <a href="#contact-us" className="mx-4 text-sm hover:underline">Contact Us</a>
          <a href="#privacy-policy" className="mx-4 text-sm hover:underline">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
