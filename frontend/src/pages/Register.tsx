/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { runQuery } from "../data/neo4jConfig";

interface RegistrationState {
  isRegistering: boolean;
  error: string | null;
  success: boolean;
  account: string | null;
}

interface RegistrationFormData {
  name: string;
  region: string;
  [key: string]: string;
}

const Register: FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [state, setState] = useState<RegistrationState>({
    isRegistering: false,
    error: null,
    success: false,
    account: null,
  });
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    region: "",
  });

  useEffect(() => {
    const checkMetaMask = async () => {
      if (!window.ethereum) {
        setState((prev) => ({
          ...prev,
          error: "Please install MetaMask to register",
        }));
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setState((prev) => ({ ...prev, account: accounts[0] }));
        }
      } catch (err) {
        console.error("Error checking MetaMask:", err);
      }
    };

    checkMetaMask();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setState((prev) => ({ ...prev, account: accounts[0] }));
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setState((prev) => ({
        ...prev,
        error: "Error connecting to MetaMask",
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.account) return;

    setState((prev) => ({ ...prev, isRegistering: true, error: null }));

    try {
      const nodeLabel = type === "patient" ? "Patient" : "HealthcareProvider";
      const query = `
        CREATE (n:${nodeLabel} {
          id: $account,
          name: $name,
          region: $region
        })
        RETURN n
      `;

      await runQuery(query, {
        account: state.account,
        ...formData,
      });

      setState((prev) => ({ ...prev, success: true }));

      // Redirect after successful registration
      setTimeout(() => {
        navigate(
          type === "patient"
            ? `/patient/${state.account}`
            : `/provider/${state.account}`
        );
      }, 2000);
    } catch (err) {
      console.error("Error registering:", err);
      setState((prev) => ({
        ...prev,
        error: "Error creating account. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isRegistering: false }));
    }
  };

  if (!type || (type !== "patient" && type !== "provider")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader
          title="Choose Registration Type"
          description="Select how you want to register"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Select Registration Type
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/register/patient")}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register as Patient
                </button>
                <button
                  onClick={() => navigate("/register/provider")}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Register as Healthcare Provider
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title={`Register as ${
          type === "patient" ? "Patient" : "Healthcare Provider"
        }`}
        description="Create your account to access the HBV Vaccine Tracker"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {type === "patient"
                ? "Patient Registration"
                : "Healthcare Provider Registration"}
            </h2>

            {state.error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {state.error}
              </div>
            )}

            {state.success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                Registration successful! Redirecting...
              </div>
            )}

            {!state.account ? (
              <button
                onClick={connectWallet}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Connect MetaMask to Register
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={state.account}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {type === "patient" ? "Full Name" : "Provider Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.isRegistering}
                  className={`w-full py-3 px-4 rounded-md text-white ${
                    state.isRegistering
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {state.isRegistering ? "Registering..." : "Register"}
                </button>
              </form>
            )}

            <div className="mt-6">
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
