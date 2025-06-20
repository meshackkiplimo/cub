// src/pages/AboutPage.tsx
import React from "react";
import landingImg from "../assets/img/h2.avif";

const AboutPage = () => (
  <div className="w-full min-h-screen bg-gray-50 flex flex-col pt-16 md:pt-20">
    {/* Adjust pt-16 (or higher) based on your navbar height */}
    <header className="w-full bg-gray-950 text-white py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center">About Us</h1>
      <p className="text-lg md:text-xl text-center mt-4 max-w-3xl mx-auto">
        Welcome to our Luxury Car Rental Service. We provide unforgettable driving experiences with a fleet of premium vehicles and exceptional customer care.
      </p>
    </header>

    <div className="flex justify-center my-8 px-4">
      <img
        src={landingImg}
        alt="Luxury Car"
        className="w-full max-w-4xl h-auto rounded-lg shadow-lg object-cover"
      />
    </div>

    <main className="px-4 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          Our mission is to make luxury accessible. Whether for business, leisure, or special occasions, we ensure a seamless rental process, top-tier vehicles, and 24/7 support.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base md:text-lg text-gray-600">
          <li className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span>Wide selection of luxury and premium vehicles</span>
          </li>
          <li className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9  Hugh 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span>24/7 customer support</span>
          </li>
          <li className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span>Fast and secure booking</span>
          </li>
          <li className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span>Professional, friendly service</span>
          </li>
          <li className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span>Flexible rental options</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Promise</h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          We are committed to quality, reliability, and satisfaction. From booking to return, our team ensures your journey is smooth and memorable.
        </p>
      </section>

      <div className="text-center py-8 bg-blue-50 rounded-lg">
        <p className="text-xl md:text-2xl text-gray-900 font-medium">
          Discover the thrill of driving excellence. Book your dream car today!
        </p>
        <a
          href="/book"
          className="mt-6 inline-block bg-amber-400 text-gray-950 px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Book Now
        </a>
      </div>
    </main>
  </div>
);

export default AboutPage;