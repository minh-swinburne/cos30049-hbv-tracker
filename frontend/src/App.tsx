/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import apiClient from "./api";
import NavigationBar from "./components/NavigationBar";
import { useMetaMask } from "./hooks/useMetaMask";
import AddVaccination from "./pages/AddVaccination";
import ApiDocs from "./pages/ApiDocs";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import VerifyVaccination from "./pages/VerifyVaccination";
import Wallet from "./pages/Wallet";
import { useStore } from "./store";

// Public routes that don't require authentication
const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/wallet", element: <Wallet /> },
  { path: "/verify", element: <VerifyVaccination /> },
  { path: "/api-docs", element: <ApiDocs /> },
];

// Protected routes that require authentication
const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowed: ["healthcareProvider", "researcher"],
  },
  {
    path: "/vaccination/add",
    element: <AddVaccination />,
    allowed: ["healthcareProvider"],
  },
];

const App: React.FC = () => {
  const { user, token, setToken, clearToken } = useStore();
  const { checkConnection, userType } = useMetaMask(); // Added userType

  useEffect(() => {
    console.log("Verifying access token...");
    const accessToken = localStorage.getItem("access-token");

    if (accessToken) {
      apiClient.baseClient.setAuthorizationToken(accessToken);
      (async () => {
        try {
          const isValid = await apiClient.auth.verifyToken();
          if (!isValid) {
            localStorage.removeItem("access-token");
            apiClient.baseClient.clearAuthorizationToken();
            clearToken();
          } else {
            setToken(accessToken);
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("access-token");
          apiClient.baseClient.clearAuthorizationToken();
        }
      })();
    } else {
      console.log("No access token found.");
      apiClient.baseClient.clearAuthorizationToken();
    }
  }, [setToken]);

  useEffect(() => {
    console.log("Token:", token);
    console.log("User:", user);
    if (token && user) {
      checkConnection();
    }
  }, [token, user, checkConnection]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Added pt-16 to account for the height of the fixed navigation bar */}
        <NavigationBar />
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Protected Routes */}
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                userType && route.allowed.includes(userType) ? (
                  route.element
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          ))}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
