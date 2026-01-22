import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import IncomeForm from "../components/Incomes/IncomeForm";
import IncomeList from "../components/Incomes/IncomeList";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import ExpenseList from "../components/Expenses/ExpenseList";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";

// Import Modal Bootstrap (Opsional jika Anda menggunakan JS Bootstrap manual, 
// pastikan script bootstrap sudah terpasang di index.html)

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardPage() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // State untuk mengontrol Modal
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/summary");
        setSummary(res.data.data || res.data);
      } catch (err) {
        console.error("fetch summary failed", err);
      }
    };
    fetchSummary();
  }, [refreshKey]);

  const onDataChanged = () => {
    setRefreshKey((k) => k + 1);
    // Tutup modal setelah data berubah
    setShowIncomeModal(false);
    setShowExpenseModal(false);
    setEditingIncome(null);
    setEditingExpense(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  const pieData = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [{ data: [summary.total_income, summary.total_expense], backgroundColor: ["#2ecc71", "#ff6b6b"], borderWidth: 1 }]
  };

  const barData = {
    labels: ["Saldo"],
    datasets: [{ label: "Saldo Akhir", data: [summary.balance], backgroundColor: "#3498db" }]
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h3 className="m-0 text-primary fw-bold">Dashboard Keuangan</h3>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Tombol Aksi Admin */}
          {user?.role === "admin" && (
            <>
              <button className="btn btn-success btn-sm" onClick={() => setShowIncomeModal(true)}>
                + Pemasukan
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setShowExpenseModal(true)}>
                - Pengeluaran
              </button>
            </>
          )}
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Profil & Summary */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm p-3 text-center h-100 border-0">
            <h6 className="text-secondary">Halo, {user?.name}</h6>
            <span className="badge bg-info text-dark mb-2">Role: {user?.role}</span>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="card shadow-sm border-0 bg-light h-100 overflow-hidden">
            <div className="row g-0 h-100">
              <div className="col-md-4 p-3 text-center d-flex flex-column justify-content-center border-end">
                <small className="text-muted">Total Saldo</small>
                <h4 className="text-primary mb-0">{formatCurrency(summary.balance)}</h4>
              </div>
              <div className="col-md-4 p-3 text-center d-flex flex-column justify-content-center border-end bg-success bg-opacity-10">
                <small className="text-success fw-bold">Total Pemasukan</small>
                <h5 className="mb-0 text-success">{formatCurrency(summary.total_income)}</h5>
              </div>
              <div className="col-md-4 p-3 text-center d-flex flex-column justify-content-center bg-danger bg-opacity-10">
                <small className="text-danger fw-bold">Total Pengeluaran</small>
                <h5 className="mb-0 text-danger">{formatCurrency(summary.total_expense)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-5">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-3 h-100 border-0">
            <h6 className="mb-3 fw-bold">Struktur Keuangan</h6>
            <div className="d-flex justify-content-center">
              <div style={{maxWidth: '250px', width:'100%'}}><Pie data={pieData} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-3 h-100 border-0">
            <h6 className="mb-3 fw-bold">Visualisasi Saldo</h6>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* List Transaksi */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <h5 className="mb-3 border-start border-4 border-success ps-2">Riwayat Pemasukan</h5>
          <IncomeList 
            refreshKey={refreshKey} 
            onEdit={(item) => { setEditingIncome(item); setShowIncomeModal(true); }} 
            cardMode 
          />
        </div>
        <div className="col-12 col-md-6">
          <h5 className="mb-3 border-start border-4 border-danger ps-2">Riwayat Pengeluaran</h5>
          <ExpenseList 
            refreshKey={refreshKey} 
            onEdit={(item) => { setEditingExpense(item); setShowExpenseModal(true); }} 
            cardMode 
          />
        </div>
      </div>

      {/* MODAL PEMASUKAN */}
      {showIncomeModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">{editingIncome ? "Edit Pemasukan" : "Tambah Pemasukan"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowIncomeModal(false); setEditingIncome(null); }}></button>
              </div>
              <div className="modal-body">
                <IncomeForm 
                  onAdded={onDataChanged} 
                  editingItem={editingIncome} 
                  onCancelEdit={() => { setShowIncomeModal(false); setEditingIncome(null); }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENGELUARAN */}
      {showExpenseModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{editingExpense ? "Edit Pengeluaran" : "Tambah Pengeluaran"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }}></button>
              </div>
              <div className="modal-body">
                <ExpenseForm 
                  onAdded={onDataChanged} 
                  editingItem={editingExpense} 
                  onCancelEdit={() => { setShowExpenseModal(false); setEditingExpense(null); }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatCurrency(v) {
  if (v == null) return "Rp -";
  const n = Number(v);
  if (!Number.isFinite(n)) return `Rp ${v}`;
  return "Rp " + n.toLocaleString("id-ID");
}