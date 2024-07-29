import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/Login_Page_Website_UI_Prototype__6_-removebg-preview.png';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/sign-in', { email, password })
      .then(result => {
        console.log(result);
        if (result.data === "Success") {
          navigate('/');
        } else {
          alert(result.data);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <main>
      <div className="flex items-center justify-center ">
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
                  className=" w-full p-3 bg-yellow-300 text-maroon-700 border-0 rounded-lg text-lg"
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
                  className="w-full p-3 bg-yellow-300 text-maroon-700 border-0 rounded-lg text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <a href="#" className="text-yellow-400 text-sm">Forget Password</a>
                <button type="submit" className="mt-3 px-4 py-2 bg-yellow-300 text-maroon-700 font-bold rounded-lg">Sign In</button>
              </div>
            </form>
            <p className="mt-4 text-white text-center">Don't have an account? <a href="sign-up.html" className="text-yellow-400">Sign Up</a></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
