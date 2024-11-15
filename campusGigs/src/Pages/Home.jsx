import React from 'react';
import partTimeImage from '../images/MSU.jpg';
import partTimeImage2 from '../images/parttimejob-removebg-preview.png';
import partTimeImage3 from '../images/womanjob-removebg-preview.png';
import partTimeImage4 from '../images/student-removebg-preview.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Home Section with Background Image */}
      <div
        className="flex flex-col lg:flex-row items-center justify-center w-full h-[550px] bg-cover bg-center bg-no-repeat py-12"
        style={{ backgroundImage: `url(${partTimeImage})` }}
      >
        <main className="flex flex-col lg:flex-row items-center flex-1 p-4 mt-3 bg-maroon-700 bg-opacity-35 h-[560px] shadow-md">
          {/* Text Section */}
          <div className="text-start p-4">
            <h1 className="text-5xl font-bold font-serif text-white">
              SEARCH, FIND AND APPLY!
            </h1>
            <p className="text-xl lg:text-1xl text-yellow-300 font-bold mt-4">
              Find the perfect part-time job that fits your lifestyle within the MSU Campus!
            </p>
            <button
            onClick={() => document.getElementById('about-us').scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 px-6 py-2 bg-yellow-300 text-black font-semibold rounded-full hover:bg-yellow-400 transition-colors duration-300"
          >
            Read More
          </button>
          </div>
          
          {/* Image Section */}
          <div className="flex-1 mt-8 lg:mt-0 flex lg:justify-end">
            <img
              src={partTimeImage4}
              alt="Student Image"
              className="w-[400px] h-[450px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </main>
      </div>

      {/* About Us Section */}
      <section id="about-us" className="w-full bg-gray-100 py-12 px-8 text-center lg:flex lg:items-center">
        <div className="lg:w-1/2 lg:mr-8">
          <img
            src={partTimeImage2}
            alt="About Us Image"
            className="w-[500px] h-auto max-h-[400px] object-cover"
          />
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0 lg:text-left">
          <h2 className="text-3xl font-bold mb-6 text-maroon-700">About Us</h2>
          <p className="text-lg max-w-4xl mx-auto mb-6 text-gray-800">
            MSU CampusGigs is a dedicated platform designed to bridge the gap between MSU students and employers.
            Our goal is to simplify the job search process, making it easier for students to find part-time jobs,
            internships, and other opportunities that suit their skills and schedules.
          </p>
          <p className="text-lg max-w-4xl mx-auto text-gray-800">
            Join us in empowering the MSU community by providing students with the opportunities they need to succeed
            in their careers!
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="w-full bg-white py-12 px-8 text-center lg:flex lg:items-center">
        <div className="lg:w-1/2 lg:mr-8 mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold mb-6 text-maroon-700">Contact Us</h2>
          <p className="text-lg mb-4 text-gray-800">For inquiries, feedback, or support, feel free to reach out to us!</p>
          <div className="text-lg text-gray-800">
            <p>Email: support@campusgigs.msu.edu</p>
            <p>Phone: +1 234 567 890</p>
            <p>Address: MSU Main Campus, Office 204</p>
          </div>
        </div>
        <div className="lg:w-1/2 ml-10">
          <img
            src={partTimeImage3}
            alt="Contact Us Image"
            className="w-[500px] h-auto max-h-[400px] object-cover"
          />
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy-policy" className="w-full bg-gray-100 py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-maroon-700">Privacy Policy</h2>
        <p className="text-lg max-w-4xl mx-auto mb-6 text-gray-800">
          At MSU CampusGigs, we are committed to protecting your privacy and ensuring that your personal
          information is secure. This Privacy Policy outlines how we collect, use, and safeguard your
          data when you use our platform.
        </p>
        <p className="text-lg max-w-4xl mx-auto text-gray-800">
          Your data will not be shared with third parties without your consent, and we employ industry-standard 
          security measures to protect your personal information.
        </p>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-yellow-300 text-black py-6 mt-12 text-center">
        <p className="text-sm">© 2024 MSU CampusGigs. All rights reserved.</p>
        <div className="flex justify-center mt-4">
          <a href="#about-us" className="mx-4 text-sm hover:underline">About Us</a>
          <a href="#contact-us" className="mx-4 text-sm hover:underline">Contact Us</a>
          <a href="#privacy-policy" className="mx-4 text-sm hover:underline">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;