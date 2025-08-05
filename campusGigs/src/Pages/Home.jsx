import React, { useState } from 'react';
import Swal from 'sweetalert2';
import partTimeImage from '../images/MSU1.png';
import partTimeImage2 from '../images/parttimejob-removebg-preview.png';
import partTimeImage3 from '../images/womanjob-removebg-preview.png';
import partTimeImage4 from '../images/student-removebg-preview.png';
import partTimeImage5 from '../images/income.png';
import partTimeImage6 from '../images/gainexp.png';
import partTimeImage7 from '../images/softskills.png';
import partTimeImage8 from '../images/timemanage.png';
import partTimeImage9 from '../images/minuteburger.jpg';
import partTimeImage10 from '../images/gratisco.jpg';
import partTimeImage11 from '../images/blackscoop.png';
import partTimeImage12 from '../images/tutor.png';
import partTimeImage13 from '../images/MSU1.png';
import partTimeImage14 from '../images/MSU2.png';




const Home = () => {
 const [selectedJob, setSelectedJob] = useState(null);

  const jobList = [
    {
      image: partTimeImage9,
      title: "Kitchen Staff",
      business: "Minute Burger MSU",
      address: "Commercial Center, MSU Campus",
      position: "Kitchen Staff",
      schedule: "Mon-Fri, 1PM - 4PM",
      rate: "250/per day",
    },
    {
      image: partTimeImage10,
      title: "Cashier",
      business: "Gratisco Cafe",
      address: "5th street, MSU Campus",
      position: "Assistant",
      schedule: "Tuesday-Fri, 2PM - 5PM",
      rate: "200/per day",
    },
    {
      image: partTimeImage11,
      title: "Bartender",
      business: "Black Scoop Cafe MSU",
      address: "3rd street, MSU Campus",
      position: "Bartender",
      schedule: "Sat-Sunday, 5PM - 8PM",
      rate: "300/per day",
    },
    {
      image: partTimeImage12,
      title: "Math Tutor",
      business: "Home Tutor",
      address: "Dimalna, MSU",
      position: "Math Tutor",
      schedule: "Weekends, 9AM - 5PM",
      rate: "350/per session",
    },
    {
      image: partTimeImage13,
      title: "Tutoring Assistant",
      business: "Learning Centre",
      address: "Block C, Room 210",
      position: "Tutor",
      schedule: "Flexible hours",
      rate: "RM15/hour",
    },
    {
      image: partTimeImage14,
      title: "IT Lab Assistant",
      business: "IT Department",
      address: "Tech Block, Lab 3",
      position: "Lab Assistant",
      schedule: "Evenings, 6PM - 9PM",
      rate: "RM11/hour",
    },
  ];

  const handleModalOpen = (index) => setSelectedJob(index);
  const handleModalClose = () => setSelectedJob(null);

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
            <p className="text-xl lg:text-2xl text-gold font-bold mt-4">
              Find the perfect part-time job that fits your lifestyle within the MSU Campus!
            </p>
     <button
  onClick={() => document.getElementById('benefits-section').scrollIntoView({ behavior: 'smooth' })}
  className="mt-6 px-6 py-2 bg-gold text-black font-semibold rounded-full hover:bg-yellow-300 transition-colors duration-300"
>
  Read More
</button>

          </div>

          {/* Image Section */}
          <div className="flex-1 flex lg:justify-end relative top-28 left-4">
            <div className="bg-white bg-opacity-25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-100 rounded-full z-0 shadow-md ml-6"></div>
            <img
              src={partTimeImage4}
              alt="Student Image"
              className="w-[250px] h-[250px] object-cover rounded-lg shadow-lg relative mr-20 mb-20"
            />
          </div>
        </main>
      </div>

{/* Benefits Section */}
<section id="benefits-section" className="w-full bg-white py-16 px-8 text-center">
  <h2 className="text-3xl font-bold text-maroon-700 mb-8">Benefits of a Part-Time Job</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
  {/* Benefit 1 */}
  <div className="flex flex-col items-center animate-fade-in">
    <img
      src={partTimeImage5}
      alt="Earn Income"
      className="w-[250px] h-[220px] object-contain rounded-lg shadow-md "
    />
    <p className="mt-4 text-lg text-black">
      Earn extra income to support your academics. 
      </p>
  </div>

  {/* Benefit 2 */}
  <div className="flex flex-col items-center animate-fade-in delay-100">
    <img
      src={partTimeImage6}
      alt="Work Experience"
      className="w-[250px] h-[220px] object-contain rounded-lg shadow-md "
    />
    <p className="mt-4 text-lg text-black">
      Gain valuable work experience.
    </p>
  </div>

  {/* Benefit 3 */}
  <div className="flex flex-col items-center animate-fade-in delay-200">
    <img
      src={partTimeImage7}
      alt="Professional Network"
      className="w-[250px] h-[220px] object-contain rounded-lg shadow-md "
    />
    <p className="mt-4 text-lg text-black">
      Build professional networks and soft skills.
    </p>
  </div>

  {/* Benefit 4 */}
  <div className="flex flex-col items-center animate-fade-in delay-300">
    <img
      src={partTimeImage8}
      alt="Time Management"
      className="w-[250px] h-[220px] object-contain rounded-lg shadow-md "
    />
    <p className="mt-4 text-lg text-black">
      Improve your time management and take on responsibility.
    </p>
  </div>
</div>

 {/* Mini Guide with SVG Icons */}
 <div className="mt-14 text-center max-w-4xl mx-auto">
  <h3 className="text-3xl font-bold text-maroon-700 mb-8">How to Search, Find, and Apply</h3>

  <ul className="space-y-8 text-lg text-gray-800">
    {/* Search Step */}
    <li className="flex items-center space-x-4">
      <div className="w-16 h-16 flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="32" height="40" rx="4" fill="#FFD700"/>
          <line x1="14" y1="16" x2="34" y2="16" stroke="#800000" strokeWidth="2"/>
          <line x1="14" y1="24" x2="34" y2="24" stroke="#800000" strokeWidth="2"/>
          <circle cx="46" cy="46" r="10" stroke="#800000" strokeWidth="4"/>
          <line x1="52" y1="52" x2="60" y2="60" stroke="#800000" strokeWidth="4"/>
        </svg>
      </div>
      <p><strong>Search:</strong> Explore our listings tailored for MSU students based on your interests and availability.</p>
    </li>

    {/* Find Step */}
    <li className="flex items-center space-x-4">
      <div className="w-16 h-16 flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="48" height="48" rx="6" fill="#FFD700"/>
          <polyline points="18,20 26,28 42,12" fill="none" stroke="#800000" strokeWidth="3"/>
          <line x1="18" y1="36" x2="46" y2="36" stroke="#800000" strokeWidth="3"/>
          <line x1="18" y1="46" x2="46" y2="46" stroke="#800000" strokeWidth="3"/>
        </svg>
      </div>
      <p><strong>Find:</strong> Match with part-time jobs that align with your skills and academic schedule.</p>
    </li>

    {/* Apply Step */}
    <li className="flex items-center space-x-4">
      <div className="w-16 h-16 flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="12" width="44" height="40" rx="6" fill="#FFD700"/>
          <path d="M18 28h28v4H18v-4zM18 36h28v4H18v-4z" fill="#800000"/>
          <circle cx="32" cy="48" r="6" stroke="#800000" strokeWidth="3" fill="none"/>
          <path d="M28 44l8 8" stroke="#800000" strokeWidth="3"/>
          <path d="M36 44l-8 8" stroke="#800000" strokeWidth="3"/>
        </svg>
      </div>
      <p><strong>Apply:</strong> Submit your application and track your status directly through the CampusGigs platform.</p>
    </li>
  </ul>
</div>
      </section>

     {/* Available Jobs Section */}
      <section id="jobs-section" className="w-full bg-gray-100 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-maroon-700 mb-12">Available Part-Time Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {jobList.map((job, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
              <img src={job.image} alt={job.title} className="w-full h-[320px] object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <button
                  onClick={() => handleModalOpen(index)}
                  className="mt-4 px-5 py-2 bg-maroon-700 text-white font-semibold rounded-full hover:bg-gold transition duration-300"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
          {/* See All Button */}
  <div className="mt-12">

          <button
            onClick={() => {
              Swal.fire({
                icon: 'info',
                title: 'Sign In Required',
                text: 'Please sign in first to view all available part-time jobs.',
                confirmButtonColor: '#FFD700', // gold
                confirmButtonText: 'OK'
              });
            }}
            className="px-8 py-3 bg-gold text-black font-semibold rounded-full hover:bg-yellow-300 transition duration-300"
          >
            See All
          </button>

  </div>

        {/* Modal Popup */}
        {selectedJob !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md relative">
              <button
                onClick={handleModalClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-4 text-maroon-700">{jobList[selectedJob].title}</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li><strong>Business Name:</strong> {jobList[selectedJob].business}</li>
                <li><strong>Address:</strong> {jobList[selectedJob].address}</li>
                <li><strong>Position:</strong> {jobList[selectedJob].position}</li>
                <li><strong>Schedule:</strong> {jobList[selectedJob].schedule}</li>
                <li><strong>Rate:</strong> {jobList[selectedJob].rate}</li>
              </ul>
            </div>
          </div>
        )}
      </section>
{/* About Us + Contact & Privacy Section */}
<section className="w-full bg-gray-100 py-16 px-8">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left items-start">
    
    {/* About Us */}
    <div>
      <img
        src={partTimeImage2}
        alt="About Us"
        className="w-full h-[400px] object-contain mb-4 mx-auto md:mx-0"
      />
      <h2 className="text-2xl font-bold text-maroon-700 mb-3">About Us</h2>
      <p className="text-gray-800 text-xl leading-relaxed">
        MSU CampusGigs is a platform that helps MSU students discover part-time job opportunities on and around campus. 
        We aim to support students in gaining experience, earning income, and developing professional skills — all while 
        balancing their academic life.
      </p>
    </div>

    {/* Contact Us + Privacy Policy */}
    <div>
      <img
        src={partTimeImage3}
        alt="Contact"
        className="w-full h-[400px] object-contain mb-4 mx-auto md:mx-0"
      />
      <h2 className="text-2xl font-bold text-maroon-700 mb-3">Contact & Privacy</h2>

      {/* Contact Info */}
      <div className="mb-4 text-base text-gray-800 leading-relaxed">
        <p>📧 Email: support@campusgigs.msu.edu</p>
        <p>📞 Phone: +1 234 567 890</p>
        <p>📍 Location: Office 204, MSU Campus</p>
      </div>

      {/* Social Icons */}
      <div className="flex space-x-4 mb-6 justify-center md:justify-start">
        <a href="https://facebook.com/msucampusgigs" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook Icon" />
        </a>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer" aria-label="Google">
          <img src="https://cdn-icons-png.flaticon.com/24/281/281764.png" alt="Google Icon" />
        </a>
      </div>

      {/* Privacy Policy Summary */}
      <p className="text-gray-700 text-base">
        We respect your privacy. All personal data is kept secure and will not be shared without your consent. 
        Our platform uses modern security measures to protect your information.
      </p>
    </div>
  </div>
</section>


      {/* Footer Section */}
      <footer className="w-full bg-gold text-black py-6 mt-12 text-center">
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

export default Home;
