// src/components/Incomes/IncomeForm.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

export default function IncomeForm({ onAdded, editingItem, onCancelEdit }) {
  const [form, setForm] = useState({ description: "", amount: "", date: "" });
  const [displayAmount, setDisplayAmount] = useState("");

  useEffect(() => {
    if (editingItem) {
      setForm({
        description: editingItem.description || "",
        amount: editingItem.amount || "",
        date: editingItem.date || "",
      });
      setDisplayAmount(formatNumberForInput(editingItem.amount));
    } else {
      setForm({ description: "", amount: "", date: "" });
      setDisplayAmount("");
    }
  }, [editingItem]);

  const handleAmountChange = (val) => {
    const digits = String(val).replace(/[^0-9]/g, "");
    const num = digits ? Number(digits) : "";
    setForm((f) => ({ ...f, amount: num }));
    setDisplayAmount(formatNumberForInput(num));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem.id) {
        await API.put(`/incomes/${editingItem.id}`, form);
        toast.success("Pemasukan diperbarui");
      } else {
        await API.post("/incomes", form);
        toast.success("Pemasukan ditambahkan");
      }
      onAdded && onAdded();
      if (!editingItem) {
        setForm({ description: "", amount: "", date: "" });
        setDisplayAmount("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2"><strong>{editingItem ? "Edit Pemasukan" : "Tambah Pemasukan"}</strong></div>
      <div className="mb-2"><input className="form-control" placeholder="Deskripsi" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} required /></div>
      <div className="mb-2"><input className="form-control" placeholder="Jumlah" value={displayAmount} onChange={(e)=>handleAmountChange(e.target.value)} required /></div>
      <div className="mb-3">
        <input
          className="form-control"
          type="datetime-local"
          value={form.date ? form.date.replace(' ', 'T') : ''} // ganti spasi jadi 'T'
          onChange={(e) => setForm({ ...form, date: e.target.value.replace('T', ' ') })} // ubah balik ke format DB
          required
        />
      </div>


      <div className="d-flex gap-2">
        <button className="btn btn-success flex-fill" type="submit">Simpan</button>
        {editingItem && <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>Batal</button>}
      </div>
    </form>
  );
}

function formatNumberForInput(v) {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toLocaleString("id-ID");
}
