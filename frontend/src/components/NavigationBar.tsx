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
import { styled } from "@mui/material/styles";
import { FC, useEffect } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { Link, useLocation } from "react-router-dom";
import { useMetaMask } from "../hooks/useMetaMask";

const StyledAvatarWrapper = styled("div")(({ theme }) => ({
  border: "2px solid white",
  borderRadius: "50%",
  display: "inline-flex", // Use inline-flex to fit the content
  alignItems: "center", // Center the avatar vertically
  justifyContent: "center", // Center the avatar horizontally
}));

const NavigationBar: FC = () => {
  const location = useLocation();
  const { account, disconnect, checkConnection, userType } = useMetaMask(); // Added userType

  useEffect(() => {
    // Update local state whenever `account` changes
    checkConnection();
  }, [account, checkConnection]);

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-700" : "";
  };

  return (
    <nav className="bg-blue-600 text-white p-3 fixed top-0 w-full z-50">
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
          {userType &&
            ["healthcareProvider", "researcher"].includes(userType) && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                  "/dashboard"
                )}`}
              >
                Dashboard
              </Link>
            )}
          {userType === "healthcareProvider" && (
            <Link
              to="/vaccination/add"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                "/vaccination/add"
              )}`}
            >
              Add Vaccination
            </Link>
          )}
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
        </div>
        <div className="flex items-center space-x-4">
          {account ? (
            <>
              <Link
                to="/wallet"
                className="rounded-md text-sm font-medium flex"
              >
                <StyledAvatarWrapper>
                  <MetaMaskAvatar address={account} size={32} />
                </StyledAvatarWrapper>
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
