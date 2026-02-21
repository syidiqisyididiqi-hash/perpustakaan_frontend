"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000/api/categories";

type Category = {
  id: number;
  name: string;
  description?: string;
};

export default function CategoryPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data?.data ?? []);
    } catch {
      alert("Gagal mengambil data kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch {
      alert("Gagal menghapus kategori");
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">

      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

          <div>
            <h1 className="text-2xl font-bold">Kategori</h1>
            <p className="text-indigo-100 text-sm">
              Mengelola kategori buku sistem perpustakaan
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full sm:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kategori..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <FiSearch size={16} />
              </button>
            </div>

            <Link href="/admin/category/create">
              <button className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-105 transition">
                <FiPlus size={16} /> Tambah Kategori
              </button>
            </Link>

          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4 text-left">Nama Kategori</th>
                <th className="p-4 text-left">Deskripsi</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-t hover:bg-indigo-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  >
                    <td className="p-4 font-semibold text-slate-800">{c.name}</td>
                    <td className="p-4 text-slate-600">{c.description || "-"}</td>
                    
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/category/${c.id}/edit`}>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                            <FiEdit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    Tidak ada kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-4 shadow border space-y-2">
            <p className="font-semibold text-slate-800">{c.name}</p>
            <p className="text-sm text-slate-600">{c.description || "-"}</p>
            <div className="flex justify-between text-sm items-center">
            
              <div className="flex gap-2">
                <Link href={`/admin/category/${c.id}/edit`}>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}