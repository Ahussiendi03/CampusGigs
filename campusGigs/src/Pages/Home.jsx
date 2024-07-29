import React from 'react';
import loginImage from '../images/Login_Page_Website_UI_Prototype-removebg-preview.png';
import partTimeImage from '../images/people-part-time-job-professions-set-vector-20585323.jpg';
import picture2Image from '../images/istockphoto-969538498-640x640.jpg';
import pictureImage from '../images/istockphoto-1402999989-612x612.jpg';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <main className="flex-1 p-4 bg-white">
        <h1 className="text-4xl lg:text-7xl font-bold font-serif py-10 text-center lg:text-left">Search, Find, and Apply!</h1>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-10">
          <img src={partTimeImage} alt="Part Time Jobs" className="w-[200px] h-[190px]" />
          <img src={picture2Image} alt="People" className="w-[200px] h-[190px] ml-20 mr-20" />
          <img src={pictureImage} alt="Work" className="w-[200px] h-[190px]" />
        </div>
      </main>
      <div className="w-full lg:w-[500px] h-full lg:h-[550px] bg-[#800000] flex items-center justify-center p-4">
        <img src={loginImage} alt="Login Page" className="w-full max-h-full lg:max-h-[500px] object-contain" />
      </div>
    </div>
  );
}

export default Home;
