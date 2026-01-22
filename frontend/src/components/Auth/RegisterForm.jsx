// src/components/Auth/RegisterForm.jsx
import React, { useState } from "react";
import API from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user", // 🔹 default role
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      toast.success("Registrasi berhasil. Silakan login.");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Konfirmasi Password</label>
          <input
            className="form-control"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            required
          />
        </div>

        {/* 🔹 Tambahan Role */}
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Daftar
        </button>
      </form>
    </div>
  );
}
