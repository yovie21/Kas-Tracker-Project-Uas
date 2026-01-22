// src/pages/UserDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function UserDashboard() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  
  const [transactions, setTransactions] = useState([]);

  // Redirect ke login kalau belum login
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user]);

  // Fetch summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/summary");
        setSummary(res.data.data || res.data);
      } catch (err) {
        console.error("Gagal ambil summary:", err);
      }
    };
    fetchSummary();
  }, []);

  // Fetch history transaksi
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data.data || res.data);
      } catch (err) {
        console.error("Gagal ambil history:", err);
      }
    };
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  const pieData = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [summary.total_income, summary.total_expense],
        backgroundColor: ["#2ecc71", "#ff6b6b"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Saldo"],
    datasets: [
      {
        label: "Saldo Akhir",
        data: [summary.balance],
        backgroundColor: "#535bf2",
      },
    ],
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header-row mb-4">
        <h3 className="text-primary">Laporan Keuangan</h3>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {/* Summary */}
      <div className="dashboard-card summary-card mb-4 text-center">
        <h5>Halo, {user?.name}</h5>
        <small className="user-info">{user?.email}</small>
        <hr />
        <div className="row">
          <div className="col-md-4 mb-2">
            <h6>Total Pemasukan</h6>
            <h4 className="text-success">{formatCurrency(summary.total_income)}</h4>
          </div>
          <div className="col-md-4 mb-2">
            <h6>Total Pengeluaran</h6>
            <h4 className="text-danger">{formatCurrency(summary.total_expense)}</h4>
          </div>
          <div className="col-md-4 mb-2">
            <h6>Saldo Akhir</h6>
            <h4 className="text-primary">{formatCurrency(summary.balance)}</h4>
          </div>
        </div>
        <hr />
        <p className="small text-muted">Anda login sebagai <b>{user?.role?.toUpperCase()}</b></p>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <h6>Perbandingan Pemasukan vs Pengeluaran</h6>
            <Pie data={pieData} />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <h6>Visualisasi Saldo</h6>
            <Bar data={barData} />
          </div>
        </div>
      </div>

      {/* History */}
      <div className="dashboard-card">
        <h6>History Transaksi</h6>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Jumlah</th>
                <th>Tipe</th>
                <th>Diinput oleh</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">Belum ada transaksi</td>
                </tr>
              ) : (
                transactions.map((tx, index) => (
                  <tr key={tx.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(tx.date).toLocaleString()}</td>
                    <td>{tx.description}</td>
                    <td>{formatCurrency(tx.amount)}</td>
                    <td>{tx.type}</td>
                    <td>{tx.user?.name || "Unknown"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper format currency
function formatCurrency(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "Rp 0";
  return "Rp " + n.toLocaleString("id-ID");
}
