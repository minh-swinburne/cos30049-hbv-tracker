/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { runQuery } from "../data/neo4jConfig";

interface VerificationResult {
  isValid: boolean;
  message: string;
  vaccinationId?: string;
}

const VerifyVaccination: FC = () => {
  const navigate = useNavigate();
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Query to find vaccination record by blockchain hash
      const query = `
        MATCH (v:Vaccination {blockchainHash: $hash})
        RETURN v.id as id
      `;

      const queryResult = await runQuery(query, { hash: transactionHash });

      if (queryResult.length === 0) {
        setResult({
          isValid: false,
          message: "No vaccination record found with this transaction hash.",
        });
        return;
      }

      const vaccinationId = queryResult[0].get("id");

      // In a real application, you would verify the blockchain transaction here
      // For now, we'll simulate the verification
      const isValid = true; // This would be the result of blockchain verification

      setResult({
        isValid,
        message: isValid
          ? "Vaccination record verified successfully!"
          : "Verification failed. The record may have been tampered with.",
        vaccinationId,
      });
    } catch (err) {
      setResult({
        isValid: false,
        message: "An error occurred during verification.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (result?.vaccinationId) {
      navigate(`/vaccination/${result.vaccinationId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Verify Vaccination Record"
        description="Verify the authenticity of a vaccination record"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Verification Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Enter Transaction Hash
            </h2>
            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <label
                  htmlFor="hash"
                  className="block text-sm font-medium text-gray-700"
                >
                  Blockchain Transaction Hash
                </label>
                <input
                  type="text"
                  id="hash"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter the blockchain transaction hash"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-white ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {loading ? "Verifying..." : "Verify Record"}
                </button>
              </div>
            </form>
          </div>

          {/* Verification Result */}
          {result && (
            <div
              className={`bg-white rounded-lg shadow-md p-6 ${
                result.isValid ? "border-green-500" : "border-red-500"
              } border-2`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`rounded-full p-2 mr-4 ${
                    result.isValid ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {result.isValid ? (
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <h3
                  className={`text-xl font-semibold ${
                    result.isValid ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.isValid
                    ? "Verification Successful"
                    : "Verification Failed"}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{result.message}</p>
              {result.isValid && result.vaccinationId && (
                <button
                  onClick={handleViewDetails}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Vaccination Details →
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyVaccination;
