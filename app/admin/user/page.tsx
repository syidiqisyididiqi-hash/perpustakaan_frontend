"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { Alert } from "@/app/lib/alert"; 

const API_URL = "http://127.0.0.1:8000/api/users";

export default function UserPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data.data ?? data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Alert.confirmDelete();

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.status) {
        Alert.error("Gagal menghapus user");
        return;
      }

      await Alert.success("User berhasil dihapus");

      fetchUsers();
    } catch {
      Alert.error("Terjadi kesalahan server");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.member_number?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (role: string) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">User</h1>
            <p className="text-indigo-100 text-sm">
              Mengelola pengguna sistem perpustakaan
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full sm:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari user..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-indigo-600 text-white"
              >
                <FiSearch size={16} />
              </button>
            </div>

            <Link href="/admin/user/create">
              <button className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-105 transition">
                <FiPlus size={16} />
                Tambah User
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
                <th className="p-4 text-center">No</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Member</th>
                <th className="p-4 text-left">Kontak</th>
                <th className="p-4 text-left">Alamat</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((u, index) => (
                  <tr key={u.id} className="border-t hover:bg-indigo-50">
                    <td className="p-4 text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>

                    <td className="p-4 text-slate-600">
                      {u.member_number || "-"}
                    </td>

                    <td className="p-4 text-slate-600">{u.phone || "-"}</td>

                    <td className="p-4 text-slate-600 max-w-sm">
                      <div className="line-clamp-2">
                        {u.address || "-"}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(u.role)}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {u.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/user/${u.id}/edit`}>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(u.id)}
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
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Tidak ada data user
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