/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientProfile from "./pages/PatientProfile";
import ProviderDashboard from "./pages/ProviderDashboard";
import VaccinationDetail from "./pages/VaccinationDetail";
import VerifyVaccination from "./pages/VerifyVaccination";
import ApiDocs from "./pages/ApiDocs";
import AdminDashboard from "./pages/AdminDashboard";
import NewVaccination from "./pages/NewVaccination";
import AddVaccination from "./pages/AddVaccination";

// Public routes that don't require authentication
const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify", element: <VerifyVaccination /> },
  { path: "/api-docs", element: <ApiDocs /> },
];

// Protected routes that require authentication
const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/patient-profile", element: <PatientProfile /> },
  { path: "/provider-dashboard", element: <ProviderDashboard /> },
  { path: "/vaccination/:id", element: <VaccinationDetail /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/vaccination/new", element: <NewVaccination /> },
  { path: "/vaccination/add", element: <AddVaccination /> },
];

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
                // TODO: Add proper authentication check
                <React.Fragment>{route.element}</React.Fragment>
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
