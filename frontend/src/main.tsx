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
import ReactDOM from "react-dom/client";
import App from "./App";
import apiClient from "./api";
import "./index.css";

console.log("Verifying access token...");
const accessToken = localStorage.getItem("access-token");

if (accessToken) {
  apiClient.baseClient.setAuthorizationToken(accessToken);
  try {
    const isValid = await apiClient.auth.verifyToken();
    if (!isValid) {
      localStorage.removeItem("access-token");
      apiClient.baseClient.clearAuthorizationToken();
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    localStorage.removeItem("access-token");
    apiClient.baseClient.clearAuthorizationToken();
  }
} else {
  console.log("No access token found.");
  apiClient.baseClient.clearAuthorizationToken();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
