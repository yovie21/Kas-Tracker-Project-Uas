import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

export default function ExpenseList({ refreshKey, onEdit }) {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat pengeluaran");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshKey]);

  const deleteExpense = async (id) => {
    if (!window.confirm("Hapus data pengeluaran ini?")) return;
    try {
      await API.delete(`/expenses/${id}`);
      toast.info("Data dihapus");
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div>
      <table className="table table-striped table-hover">
        <thead>
          <tr><th>No</th><th>Deskripsi</th><th>Jumlah</th><th>Tanggal</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {expenses.map((e, i) => (
            <tr key={e.id || e._id}>
              <td>{i+1}</td>
              <td style={{maxWidth:200, wordBreak:'break-word'}}>{e.description}</td>
              <td>{formatCurrency(e.amount)}</td>
              <td>{formatDateTime(e.date, e.created_at)}</td>
              <td>
                <button className="btn btn-sm btn-primary me-1" onClick={()=>onEdit && onEdit(e)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>deleteExpense(e.id || e._id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(v) {
  if (v == null) return "-";
  const n = Number(v);
  if (!Number.isFinite(n)) return v;
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDateTime(dateString) {
  if (!dateString) return "-";
  try {
    const options = {
      timeZone: "Asia/Jakarta",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    return new Date(dateString).toLocaleString("id-ID", options) + " WIB";
  } catch {
    return dateString;
  }
}