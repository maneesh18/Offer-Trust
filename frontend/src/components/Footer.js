import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FaShieldAlt className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">OfferTrust</span>
          </div>
          
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; 2025 OfferTrust. All rights reserved. Protecting job seekers from fraudulent offers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;