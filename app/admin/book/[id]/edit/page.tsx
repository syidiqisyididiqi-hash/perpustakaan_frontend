"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    status: "Available",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Book ID ${params.id} berhasil diupdate`);
    router.push("/admin/book");
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Edit Buku</h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui data buku</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Judul Buku</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Penulis</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Kategori</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Stok</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
