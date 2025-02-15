import React from "react";

const StatCard = ({ title, value, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-blue-900 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-blue-800 mb-2">{value}</div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default StatCard;
