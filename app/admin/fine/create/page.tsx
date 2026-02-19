"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateFinePage() {
  const router = useRouter();

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Sarah Smith" },
    { id: 3, name: "Michael Jordan" },
  ];

  const books = [
    { id: 1, title: "Clean Code", finePerDay: 5000 },
    { id: 2, title: "Atomic Habits", finePerDay: 3000 },
    { id: 3, title: "Design Patterns", finePerDay: 4000 },
  ];

  const [form, setForm] = useState({
    user_id: "",
    book_id: "",
    days: "",
    amount: "",
  });

  useEffect(() => {
    const selectedBook = books.find((b) => b.id.toString() === form.book_id);
    if (selectedBook && form.days) {
      setForm((prev) => ({
        ...prev,
        amount: (selectedBook.finePerDay * Number(prev.days)).toString(),
      }));
    } else {
      setForm((prev) => ({ ...prev, amount: "" }));
    }
  }, [form.book_id, form.days]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("DATA FINE:", form);
    router.push("/admin/fine");
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Tambah Fine
        </h1>

        <p className="text-slate-500 text-sm mb-6">
          Isi data lengkap untuk menambahkan denda baru
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Pilih User</label>
            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            >
              <option value="">-- Pilih User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Pilih Buku</label>
            <select
              name="book_id"
              value={form.book_id}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            >
              <option value="">-- Pilih Buku --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (Rp {b.finePerDay}/hari)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Days Late</label>
            <input
              type="number"
              name="days"
              value={form.days}
              onChange={handleChange}
              placeholder="Jumlah hari terlambat"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Jumlah Denda</label>
            <input
              type="text"
              name="amount"
              value={form.amount ? `Rp ${Number(form.amount).toLocaleString()}` : ""}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-slate-50 transition"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-700 shadow-sm transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
