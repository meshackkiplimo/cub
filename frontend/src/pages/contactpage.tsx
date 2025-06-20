import React, { useState } from 'react';
import contact from '../assets/img/cr.avif'; // Ensure this image has a transparent background

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center pt-20 sm:pt-24 p-4 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        {/* Form Container */}
        <div className="bg-gray-800/30 backdrop-blur-lg p-8 w-full lg:w-1/2 flex flex-col justify-center rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-indigo-500 animate-pulse-subtle">
            Get in Touch
          </h1>
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-600/50 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-900/50 text-white placeholder-gray-400 transition-all duration-200 hover:border-amber-400"
                placeholder="Enter your name"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-600/50 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-900/50 text-white placeholder-gray-400 transition-all duration-200 hover:border-amber-400"
                placeholder="Enter your email"
                required
                aria-required="true"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-600/50 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-900/50 text-white placeholder-gray-400 transition-all duration-200 hover:border-blue-400 h-32 resize-none"
                placeholder="Tell us how we can help you"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-400 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              Or reach us at{' '}
              <a href="mailto:support@example.com" className="text-blue-400 hover:underline">
                support@example.com
              </a>
            </p>
            <p className="mt-2">
              Follow us on{' '}
              <a href="https://x.com/example" className="text-amber-400 hover:underline">
                X
              </a>
            </p>
          </div>
        </div>
        {/* Image Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={contact}
            alt="Contact Us Illustration"
            className="rounded-xl w-full h-auto max-h-80 lg:max-h-96 object-contain transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;