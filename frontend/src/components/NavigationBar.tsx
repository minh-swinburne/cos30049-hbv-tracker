/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { Logout, Wallet } from "@mui/icons-material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMetaMask } from "../hooks/useMetaMask";

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const { account, userType, disconnect } = useMetaMask();

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
            to="/vaccination/add"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
              "/vaccination/add"
            )}`}
          >
            Add Vaccination
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
        <div className="flex items-center space-x-4">
          {account ? (
            <>
              <Link
                to="/wallet"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                  "/wallet"
                )}`}
              >
                <Wallet className="mr-2" />
                Wallet
              </Link>
              <button
                onClick={disconnect}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Logout
                <Logout className="ml-2" />
              </button>
            </>
          ) : (
            <Link
              to="/wallet"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                "/wallet"
              )}`}
            >
              <Wallet className="mr-2" />
              Wallet
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
