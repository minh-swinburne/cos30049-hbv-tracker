/**
 * @file ApiDocs.tsx
 * @description API Documentation page for the HBV Tracker application
 * @author Group 3
 * @date 2024-03-20
 */

import { FC } from "react";

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
              {/* Authentication API */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">
                  Authentication API
                </h4>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <strong>POST /api/auth/token</strong>: Generate Access Token
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Request Body:</strong>{" "}
                        {
                          "{address: string, message: string, signature: string}"
                        }
                      </li>
                      <li>
                        <strong>Response:</strong>{" "}
                        {"{accessToken: string, tokenType: string}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>GET /api/auth/verify</strong>: Verify Access Token
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Response:</strong> boolean
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Neo4j Graph Database API */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">
                  Neo4j Graph Database API
                </h4>
                <h5 className="font-semibold">Patient Endpoints</h5>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <strong>GET /api/graph/patient/{"{address}"}</strong>: Read
                    Patient
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> Patient Node Details
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>
                      GET /api/graph/patient/{"{address}"}/records
                    </strong>
                    : Read Patient Vaccinations
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> Vaccination Records
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>POST /api/graph/patient/create</strong>: Create
                    Patient
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Request Body:</strong> Patient Node Data
                      </li>
                      <li>
                        <strong>Response:</strong> Created Patient Node
                      </li>
                    </ul>
                  </li>
                </ul>
                <h5 className="font-semibold">Healthcare Provider Endpoints</h5>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <strong>GET /api/graph/provider/{"{address}"}</strong>: Read
                    Provider
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> Provider Node Details
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>
                      GET /api/graph/provider/{"{address}"}/records
                    </strong>
                    : Read Provider Vaccinations
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> Vaccination Records
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>POST /api/graph/provider/create</strong>: Create
                    Provider
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Request Body:</strong> Provider Node Data
                      </li>
                      <li>
                        <strong>Response:</strong> Created Provider Node
                      </li>
                    </ul>
                  </li>
                </ul>
                <h5 className="font-semibold">Vaccination Endpoints</h5>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <strong>GET /api/graph/vaccination/{"{tx_hash}"}</strong>:
                    Read Vaccination
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> tx_hash (path)
                      </li>
                      <li>
                        <strong>Response:</strong> Vaccination Record
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>POST /api/graph/vaccination/create</strong>: Create
                    Vaccination
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Request Body:</strong> Vaccination and Provider
                        Data
                      </li>
                      <li>
                        <strong>Response:</strong> Created Vaccination Node
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Blockchain API */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">
                  Blockchain API
                </h4>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <strong>GET /api/blockchain/address</strong>: Read Contract
                    Address
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Response:</strong> {"{address: string}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>GET /api/blockchain/admin</strong>: Read Admin
                    Address
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Response:</strong> {"{address: string}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>GET /api/blockchain/provider/{"{address}"}</strong>:
                    Check Provider Registration
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> {"{authorized: boolean}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>
                      GET /api/blockchain/researcher/{"{address}"}
                    </strong>
                    : Check Researcher Registration
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> {"{authorized: boolean}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>POST /api/blockchain/store</strong>: Store
                    Vaccination
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Request Body:</strong> Vaccination data,
                        addresses, message, signature
                      </li>
                      <li>
                        <strong>Response:</strong>{" "}
                        {"{dataHash: string, txHash: string}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>GET /api/blockchain/get/{"{address}"}</strong>: Get
                    Vaccination Hashes
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path)
                      </li>
                      <li>
                        <strong>Response:</strong> Array of{" "}
                        {"{dataHash: string, timestamp: integer}"}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>GET /api/blockchain/verify/{"{address}"}</strong>:
                    Verify Vaccination Hash
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Parameters:</strong> address (path), txHash
                        (query)
                      </li>
                      <li>
                        <strong>Response:</strong>{" "}
                        {"{dataHash: string, txHash: string}"}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Root Endpoint */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">
                  Root Endpoint
                </h4>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>
                    <strong>GET /</strong>: Root Endpoint
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>Response:</strong> Empty JSON Response
                      </li>
                    </ul>
                  </li>
                </ul>
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
