'use client';
import React from 'react';


    const Footer: React.FC = () => {
      return (
        <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 ShopSmart. All rights reserved.</p>

        {/* Social Media Links */}
        <div className="mt-4 flex justify-center space-x-6">
          <div
            onClick={() => window.open('https://facebook.com', '_blank')}
            className="cursor-pointer hover:text-gray-400"
          >
            Facebook
          </div>
          <div
            onClick={() => window.open('https://twitter.com', '_blank')}
            className="cursor-pointer hover:text-gray-400"
          >
            Twitter
          </div>
          <div
            onClick={() => window.open('https://instagram.com', '_blank')}
            className="cursor-pointer hover:text-gray-400"
          >
            Instagram
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;