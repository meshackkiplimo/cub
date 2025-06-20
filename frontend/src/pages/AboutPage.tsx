// src/pages/AboutPage.tsx
import React from "react";
import landingImg from "../assets/img/h2.avif";

const AboutPage: React.FC = () => (
  <div className="w-full min-h-screen bg-white/90 p-0 m-0 flex flex-col">
    <h1 className="text-4xl font-bold text-center text-gray-900 mt-0 mb-4 w-full">About Us</h1>
    <p className="text-lg text-gray-700 text-center mb-8 w-full">
      Welcome to our Luxury Car Rental Service. We provide unforgettable driving experiences with a fleet of premium vehicles and exceptional customer care.
    </p>
    <div className="flex justify-center mb-8 w-full">
      <img
        src={landingImg}
        alt="Luxury Car"
        className="w-full max-w-2xl rounded-none shadow-none border-0 object-cover"
      />
    </div>
    <div className="px-4 md:px-24 w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
      <p className="text-base text-gray-700 mb-6">
        Our mission is to make luxury accessible. Whether for business, leisure, or special occasions, we ensure a seamless rental process, top-tier vehicles, and 24/7 support.
      </p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Why Choose Us?</h2>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-1">
        <li>Wide selection of luxury and premium vehicles</li>
        <li>24/7 customer support</li>
        <li>Fast and secure booking</li>
        <li>Professional, friendly service</li>
        <li>Flexible rental options</li>
      </ul>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Promise</h2>
      <p className="text-base text-gray-700 mb-4">
        We are committed to quality, reliability, and satisfaction. From booking to return, our team ensures your journey is smooth and memorable.
      </p>
      <p className="text-lg text-center text-gray-900 mt-8 font-medium">
        Discover the thrill of driving excellence. Book your dream car today!
      </p>
    </div>
  </div>
);

export default AboutPage;