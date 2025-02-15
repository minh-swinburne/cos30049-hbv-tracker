import React from "react";

const NavigationBar = () => (
  <nav className="bg-teal-600 text-white p-4 sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">HPV Vaccine Analytics</h1>
      <div className="flex gap-6">
        <a href="#overview" className="hover:text-teal-200">
          Overview
        </a>
        <a href="#statistics" className="hover:text-teal-200">
          Statistics
        </a>
        <a href="#trends" className="hover:text-teal-200">
          Trends
        </a>
        <a href="#impact" className="hover:text-teal-200">
          Impact
        </a>
      </div>
    </div>
  </nav>
);

export default NavigationBar;
