import React from 'react';
import { NavLink } from 'react-router-dom';
import Landing from '../assets/img/h2.avif'

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Main content */}
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left column - Text content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Luxury Car <br />
              <span className="text-primary">Rental Service</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg mx-auto lg:mx-0">
              Experience the thrill of driving premium vehicles. Book your dream car today and enjoy the journey in style.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NavLink to="/cars" 
                className="btn btn-primary group bg-amber-400 hover:bg-green-800">
                Browse Cars
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </NavLink>
              <NavLink to="/contact" 
                className="btn btn-outline text-gray-950 hover:text-primary bg-amber-400 hover:bg-green-800 border-gray-950">
                Contact Us
              </NavLink>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="p-3 rounded-lg bg-gray-200 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-primary">24/7</h3>
                <p className="text-sm text-gray-400">Support</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-200 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-primary">100%</h3>
                <p className="text-sm text-gray-400">Secure</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-200 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-primary">Fast</h3>
                <p className="text-sm text-gray-400">Delivery</p>
              </div>
            </div>
          </div>

          {/* Right column - Car Image */}
          <div className="relative max-w-lg mx-auto lg:max-w-full">
            <div className="relative z-10 p-4">
              <img 
                src={Landing}
                alt="Luxury Car"
                className="w-full h-auto max-w-md mx-auto object-contain transform hover:scale-105 transition-transform duration-500 border-amber-400 border-4 rounded-lg shadow-lg hover:shadow-2xl hover:border-amber-500"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-primary/20 blur-2xl -z-10"></div>
            
            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-xl">
              <div className="text-white">
                <p className="text-lg font-bold">Premium</p>
                <p className="text-xs opacity-75">Quality Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
