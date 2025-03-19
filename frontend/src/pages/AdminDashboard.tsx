/**
 * @file AdminDashboard.tsx
 * @description Admin Dashboard page for system moderators
 * @author Group 3
 * @date 2024-03-20
 */

import React, { FC } from "react";

const AdminDashboard: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Management
          </h2>
          <p className="text-gray-600 mb-4">
            Manage user accounts, permissions, and access levels.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage Users
          </button>
        </div>

        {/* System Health Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Health
          </h2>
          <p className="text-gray-600 mb-4">
            Monitor system performance and health metrics.
          </p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Metrics
          </button>
        </div>

        {/* Content Moderation Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Content Moderation
          </h2>
          <p className="text-gray-600 mb-4">
            Review and moderate user-generated content.
          </p>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Moderate Content
          </button>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
          <p className="text-gray-600 mb-4">
            View and manage system reports and analytics.
          </p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            View Reports
          </button>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Settings
          </h2>
          <p className="text-gray-600 mb-4">
            Configure system-wide settings and parameters.
          </p>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Configure
          </button>
        </div>

        {/* Audit Logs Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Audit Logs
          </h2>
          <p className="text-gray-600 mb-4">
            View system activity and audit trails.
          </p>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
