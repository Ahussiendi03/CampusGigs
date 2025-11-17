import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../images/Login_Page_Website_UI_Prototype__6_-removebg-preview.png';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://localhost:5000/sign-in', { email, password });
      if (result.data.status === "Success") {
        const { role, employerId, applicantId, parentId } = result.data;
        

        if (role === "employer" && employerId) {
          localStorage.setItem('employerId', employerId);
        } else if (role === "applicant" && applicantId) {
          localStorage.setItem('applicantId', applicantId);
        } else if (role === "parent" && parentId) {
          localStorage.setItem('parentId', parentId);
        }

        if (role === "employer") {
          navigate('/EmployerDb');
        } else if (role === "parent") {
          navigate('/ParentDashboard');
        } else if (role === "applicant") {
          navigate('/ApplicantDashboard');
        } else if (role === "admin") {
          navigate('/AdminDashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMessage(result.data.message || 'Login failed. Please try again.');
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error signing in:", err);
      setErrorMessage('An error occurred while signing in. Please check your credentials or try again later.');
      setShowModal(true);
    }
  };

  return (
    <main>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Error</h3>
            <p className="text-gray-800 mb-6">{errorMessage}</p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center">
        <img src={loginImage} alt="Login Page" className="ml-24 w-1/2 h-auto mb-6 lg:mb-0 lg:mr-10" />
        <div className="ml-48 bg-maroon-700 rounded-lg shadow-md p-6 w-full flex items-center" style={{ height: '550px' }}>
          <div className="w-full mb-10">
            <h2 className="text-3xl font-bold text-gold mb-4 text-center">SIGN IN</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-yellow-400 text-base mb-2">EMAIL:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 bg-white text-black border-0 rounded-lg text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mt-2">
                <label htmlFor="password" className="block text-yellow-400 text-base mb-2">PASSWORD:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 bg-white text-black border-0 rounded-lg text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link to="/forgot-password" className="text-yellow-400 text-sm"></Link>
                <button type="submit" className="px-4 py-2 bg-yellow-300 text-maroon-700 font-bold rounded-lg">
                  Sign In
                </button>
              </div>
            </form>
            <p className="mt-4 text-white text-center">
              Don't have an account? <Link to="/sign-up" className="text-yellow-400">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full bg-gold text-black py-6 text-center">
        <p className="text-sm">© 2025 MSU CampusGigs. All rights reserved.</p>
        <div className="flex justify-center mt-4">
          <a href="#about-us" className="mx-4 text-sm hover:underline">About Us</a>
          <a href="#contact-us" className="mx-4 text-sm hover:underline">Contact Us</a>
          <a href="#privacy-policy" className="mx-4 text-sm hover:underline">Privacy Policy</a>
        </div>
      </footer>
    </main>
  );
};

export default SignIn;
