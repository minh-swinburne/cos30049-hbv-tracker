/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { Logout, Wallet } from "@mui/icons-material"; // Import Wallet and Logout icons
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMetaMask } from "../hooks/useMetaMask"; // Import useMetaMask hook

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const { isConnected, disconnectWallet } = useMetaMask(); // Access MetaMask state and disconnect function

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-700" : "";
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
              "/"
            )}`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
              "/dashboard"
            )}`}
          >
            Dashboard
          </Link>
          <Link
            to="/verify"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
              "/verify"
            )}`}
          >
            Verify
          </Link>
          <Link
            to="/api-docs"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
              "/api-docs"
            )}`}
          >
            API Docs
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
              "/admin"
            )}`}
          >
            Admin
          </Link>
        </div>
        <div className="flex space-x-4">
          {isConnected ? (
            <button
              onClick={disconnectWallet}
              className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
            >
              Logout
              <Logout className="w-5 h-5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                  "/login"
                )}`}
              >
                <Wallet className="mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                  "/register"
                )}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
