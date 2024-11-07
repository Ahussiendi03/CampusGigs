import React from 'react';
import loginImage from '../images/Login_Page_Website_UI_Prototype-removebg-preview.png';
import partTimeImage from '../images/people-part-time-job-professions-set-vector-20585323.jpg';
import picture2Image from '../images/istockphoto-969538498-640x640.jpg';
import pictureImage from '../images/istockphoto-1402999989-612x612.jpg';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Home Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <main className="flex-1 p-4 bg-white mb-16">
          <h1 className="text-4xl mb-10 lg:text-6xl font-bold font-serif py-10 text-center">Search, Find, and Apply!</h1>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-18">
            <img src={partTimeImage} className="w-1/3 h-[220px]" />
            <img src={picture2Image} className="w-[300px] h-[220px]" />
            <img src={pictureImage} className="w-1/4 h-[220px]" />
          </div>
        </main>
        <div className="w-[500px] h-[550px] bg-[#800000] flex items-center justify-center p-4">
          <img src={loginImage} alt="Login Page" className="w-full max-h-full lg:max-h-[500px] object-contain" />
        </div>
      </div>

      {/* About Us Section */}
      <section id="about-us" className="w-full bg-gray-100 py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-lg max-w-4xl mx-auto mb-6">
          MSU CampusGigs is a dedicated platform designed to bridge the gap between MSU students and employers.
          Our goal is to simplify the job search process, making it easier for students to find part-time jobs,
          internships, and other opportunities that suit their skills and schedules. We believe in creating
          a transparent, accessible space where both students and employers can connect effectively. Whether you're
          an employer looking to hire top MSU talent or a student seeking to gain experience, MSU CampusGigs is the 
          solution.
        </p>
        <p className="text-lg max-w-4xl mx-auto">
          Our platform is user-friendly and intuitive, offering features like real-time job listings, easy
          application tracking, and communication tools to ensure a smooth process from posting to hiring. Join 
          us in empowering the MSU community by providing students with the opportunities they need to succeed
          in their careers!
        </p>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="w-full bg-white py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <p className="text-lg mb-4">For inquiries, feedback, or support, feel free to reach out to us!</p>
        <div className="text-lg">
          <p>Email: support@campusgigs.msu.edu</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: MSU Main Campus, Office 204</p>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy-policy" className="w-full bg-gray-100 py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
        <p className="text-lg max-w-4xl mx-auto mb-6">
          At MSU CampusGigs, we are committed to protecting your privacy and ensuring that your personal
          information is secure. This Privacy Policy outlines how we collect, use, and safeguard your
          data when you use our platform. We collect information to improve your user experience, 
          provide job opportunities, and communicate with you regarding updates and job listings. Your 
          data will not be shared with third parties without your consent, and we employ industry-standard 
          security measures to protect your personal information.
        </p>
        <p className="text-lg max-w-4xl mx-auto">
          By using MSU CampusGigs, you agree to this Privacy Policy. If you have any concerns or questions 
          regarding your privacy, please contact us at support@campusgigs.msu.edu. We are committed to 
          safeguarding your rights and providing transparency in how your data is handled.
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