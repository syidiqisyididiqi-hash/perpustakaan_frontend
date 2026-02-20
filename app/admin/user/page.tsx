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
      setUsers(res.data ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user?")) return;
    await usersApi.delete(id);
    fetchUsers();
  };

  const handleSearch = () => {
    setSearch(query);
  };

  const filtered = users.filter((u) =>
    [u.name, u.email, u.member_number]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manajemen User</h1>
            <p className="text-slate-300 text-sm">
              Kelola pengguna sistem perpustakaan
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari user..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <button
                onClick={handleSearch}
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
      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading...</div>
      ) : (
        <div className="hidden md:block bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">No Anggota</th>
                <th className="px-6 py-4 text-left">Kontak</th>
                <th className="px-6 py-4 text-left">Alamat</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50 transition"
                >
                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* MEMBER */}
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {u.member_number || "-"}
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-4 text-slate-700">
                    {u.phone || "-"}
                  </td>

                  {/* ADDRESS */}
                  <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                    {u.address || "-"}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                      {u.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {u.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/user/${u.id}/edit`}>
                        <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                          <FiEdit size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-slate-400"
                  >
                    Tidak ada data user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}