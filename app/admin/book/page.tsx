"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { Alert } from "@/app/lib/alert"; 

const API_URL = "http://127.0.0.1:8000/api/books";

type Book = {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  published_year?: number;
  rack_code?: string;
  category?: { name: string };
  stock: number;
  cover?: string;
};

export default function BookPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBooks(data.data ?? []);
    } catch {
      Alert.error("Gagal mengambil data buku");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Alert.confirmDelete();
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        Alert.error(data.message || "Gagal menghapus buku");
        return;
      }

      await Alert.success("Buku berhasil dihapus");
      fetchBooks();
    } catch {
      Alert.error("Terjadi kesalahan server");
    }
  };

  const filtered = books.filter((b) => {
    const keyword = search.toLowerCase();
    return (
      (b.title || "").toLowerCase().includes(keyword) ||
      (b.author || "").toLowerCase().includes(keyword) ||
      (b.isbn || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Books</h1>
            <p className="text-indigo-100 text-sm">
              Mengelola koleksi buku perpustakaan
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full sm:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari buku..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-indigo-600 text-white"
              >
                <FiSearch size={16} />
              </button>
            </div>

            <Link href="/admin/book/create">
              <button className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-105 transition">
                <FiPlus size={16} />
                Tambah Buku
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
                <th className="p-4 text-left">Cover</th>
                <th className="p-4 text-left">Buku</th>
                <th className="p-4 text-center">ISBN</th>
                <th className="p-4 text-center">Penerbit</th>
                <th className="p-4 text-center">Tahun</th>
                <th className="p-4 text-center">Rak</th>
                <th className="p-4 text-center">Kategori</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-t hover:bg-indigo-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="p-4">
                      {b.cover ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${b.cover}`}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{b.title}</p>
                      <p className="text-xs text-slate-500">{b.author}</p>
                    </td>

                    <td className="p-4 text-center text-slate-600">{b.isbn || "-"}</td>
                    <td className="p-4 text-center text-slate-600">{b.publisher || "-"}</td>
                    <td className="p-4 text-center">{b.published_year || "-"}</td>
                    <td className="p-4 text-center">{b.rack_code || "-"}</td>
                    <td className="p-4 text-center">{b.category?.name || "-"}</td>
                    <td className="p-4 text-center">{b.stock}</td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          b.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.stock > 0 ? "Available" : "Out of Stock"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/book/${b.id}/edit`}>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    Tidak ada data buku
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}