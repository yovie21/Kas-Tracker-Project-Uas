import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';

export default function IncomeForm({ onAdded, editingItem, onCancelEdit }) {
  const [form, setForm] = useState({ description: '', amount: '', date: '' });
  const [displayAmount, setDisplayAmount] = useState('');

  useEffect(() => {
    if (editingItem) {
      setForm({
        description: editingItem.description || '',
        amount: editingItem.amount || '',
        date: editingItem.date || '',
      });
      setDisplayAmount(formatNumberForInput(editingItem.amount));
    } else {
      setForm({ description: '', amount: '', date: '' });
      setDisplayAmount('');
    }
  }, [editingItem]);

  const handleAmountChange = (val) => {
    const digits = String(val).replace(/[^0-9]/g, '');
    const num = digits ? Number(digits) : '';
    setForm(f => ({ ...f, amount: num }));
    setDisplayAmount(formatNumberForInput(num));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem.id) {
        await API.put(`/incomes/${editingItem.id}`, form);
        toast.success('Pemasukan berhasil diperbarui');
      } else {
        await API.post('/incomes', form);
        toast.success('Pemasukan berhasil ditambahkan');
      }
      onAdded && onAdded();
      if (!editingItem) {
        setForm({ description: '', amount: '', date: '' });
        setDisplayAmount('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan data';
      toast.error(msg);
      console.error(err.response || err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h5 style={{marginTop:0}}>{editingItem ? 'Edit Pemasukan' : 'Tambah Pemasukan'}</h5>
      <input type="text" placeholder="Deskripsi" className="form-control"
             value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>

      <input type="text" placeholder="Jumlah" className="form-control"
             value={displayAmount} onChange={(e)=>handleAmountChange(e.target.value)}/>

      <input type="date" className="form-control"
             value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})}/>

      <div style={{display:'flex', gap: '0.5rem'}}>
        <button className="btn btn-success w-100" type="submit">Simpan</button>
        {editingItem && <button type="button" className="btn" onClick={onCancelEdit}>Batal</button>}
      </div>
    </form>
  );
}

function formatNumberForInput(v){
  if (v == null || v === '') return '';
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toLocaleString('id-ID');
}
