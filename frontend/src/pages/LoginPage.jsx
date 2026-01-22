// src/pages/LoginPage.jsx
import React from "react";
import LoginForm from "../components/Auth/LoginForm.jsx";

export default function LoginPage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: 380 }}>
        <LoginForm />
      </div>
    </div>
  );
}
