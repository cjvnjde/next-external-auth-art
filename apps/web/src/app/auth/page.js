"use client";

import { API_URL } from "../../config";

export default function Auth() {
  const handleLogin = async () => {
    await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
    });
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "140px",
      }}
    >
      <button type="button" onClick={handleLogin}>
        Login
      </button>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
