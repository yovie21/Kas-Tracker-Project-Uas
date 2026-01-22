// src/pages/RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: 420 }}>
        <h4 className="text-center mb-3">Daftar Akun</h4>
        <RegisterForm />
      </div>
    </div>
 
);
}
