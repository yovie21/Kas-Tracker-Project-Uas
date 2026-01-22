// src/components/Auth/LoginForm.jsx
import React, { useContext, useState } from "react";
import API, { setToken } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { setToken: setCtxToken, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      console.log("LOGIN RESPONSE:", res.data); // DEBUG

      const { token, user } = res.data.data || res.data;
      if (!token) throw new Error("Token tidak ditemukan di response");

      // Simpan token
      setToken(token);
      setCtxToken(token);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login berhasil!");

      // 🔥 ROLE REDIRECT
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 700);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h4 className="text-center mb-3">Login</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </div>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <div className="text-center mt-3">
          <a href="/register">Belum punya akun? Daftar</a>
        </div>
      </form>
    </div>
  );
}
