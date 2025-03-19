/**
 * @file ApiDocs.tsx
 * @description API Documentation page for the HBV Tracker application
 * @author Group 3
 * @date 2024-03-20
 */

import React, { FC } from "react";

const ApiDocs: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        API Documentation
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
        <p className="text-gray-600 mb-6">
          This documentation provides details about the HBV Tracker API
          endpoints and their usage.
        </p>

        <div className="space-y-8">
          {/* Authentication Section */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Authentication
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">
                All API endpoints require authentication using MetaMask wallet
                signatures.
              </p>
            </div>
          </section>

          {/* Endpoints Section */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Endpoints
            </h3>
            <div className="space-y-4">
              {/* Placeholder for endpoint documentation */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">
                  Endpoint documentation will be added here.
                </p>
              </div>
            </div>
          </section>

          {/* Error Handling Section */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Error Handling
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">
                Standard error responses and handling procedures will be
                documented here.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
