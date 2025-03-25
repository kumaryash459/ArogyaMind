import React from 'react';
import { Link } from 'react-router-dom'; // For navigation to the signup form or login page

const Signup = () => {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b803d7d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      {/* Frosted Glass Overlay */}
      <div className="absolute inset-0 bg-dark-100 bg-opacity-50 backdrop-blur-md"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Greeting Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Hi, I am ArogyaMind
        </h1>

        {/* Sign Up Button */}
        <Link to="/signup-form">
          <button className="px-6 py-3 bg-primary text-white text-lg font-medium rounded-full hover:bg-[#e07b00] transition">
            Sign up to chat
          </button>
        </Link>

        {/* Sign Up or Login Text */}
        <p className="mt-4 text-gray-300 text-sm uppercase">
          Sign up or login to chat
        </p>
      </div>

      {/* Top-Right Sign Up Link */}
      <div className="absolute top-4 right-4 z-10">
        <Link to="/signup-form">
          <button className="px-4 py-2 bg-white text-dark-300 text-sm font-medium rounded-full hover:bg-gray-200 transition">
            Sign up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;