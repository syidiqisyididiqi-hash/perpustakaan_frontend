"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { usersApi } from "@/app/lib/api/users";

export default function UserPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus user ini?")) return;
    await usersApi.delete(id);
    fetchUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.member_number?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (role: string) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "staff") return "bg-blue-100 text-blue-700";
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">Manajemen User</h1>
            <p className="text-slate-300 text-sm">
              Kelola pengguna sistem perpustakaan
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari user..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-slate-900 text-white"
              >
                <FiSearch />
              </button>
            </div>

            <Link href="/admin/user/create">
              <button className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-xl text-sm font-semibold shadow hover:bg-slate-100">
                <FiPlus />
                Tambah
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-semibold">User</th>
                <th className="p-4 text-left">No Anggota</th>
                <th className="p-4 text-left">Kontak</th>
                <th className="p-4 text-left">Alamat</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    Loading data...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-t transition hover:bg-slate-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                    }`}
                  >
                    {/* USER */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>

                    {/* MEMBER */}
                    <td className="p-4 text-slate-600">
                      {u.member_number || "-"}
                    </td>

                    {/* CONTACT */}
                    <td className="p-4 text-slate-600">
                      {u.phone || "-"}
                    </td>

                    {/* ADDRESS */}
                    <td className="p-4 max-w-xs truncate text-slate-600">
                      {u.address || "-"}
                    </td>

                    {/* ROLE */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                        <Link href={`/admin/user/${u.id}/edit`}>
                          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-slate-400"
                  >
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