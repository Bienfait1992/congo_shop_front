// components/Footer.jsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 text-gray-600 text-sm px-4 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left */}
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Mon Dashboard Admin
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
          <span className="hover:text-gray-900 cursor-pointer">Aide</span>
          <span className="hover:text-gray-900 cursor-pointer">Support</span>
          <span className="hover:text-gray-900 cursor-pointer">Confidentialité</span>
          <span className="hover:text-gray-900 cursor-pointer">Conditions</span>
        </div>

        {/* Right */}
        <div className="text-center md:text-right">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
};