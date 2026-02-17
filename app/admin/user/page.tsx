"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function UserPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const users = [
    { id: 1, name: "John Doe", email: "john@mail.com", role: "Admin", status: "Active", initial: "J", color: "from-indigo-500 to-purple-600" },
    { id: 2, name: "Sarah Smith", email: "sarah@mail.com", role: "User", status: "Pending", initial: "S", color: "from-pink-500 to-rose-500" },
  ];

  const handleSearch = () => {
    setSearch(query);
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-slate-300 text-sm">Manage your system users</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <button
                onClick={handleSearch}
                className="px-4 bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition"
              >
                <FiSearch />
              </button>
            </div>

            <Link href="/admin/user/create">
              <button className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-xl text-sm font-semibold shadow hover:bg-slate-100 transition">
                <FiPlus />
                Add
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${u.color} text-white flex items-center justify-center font-bold`}>
                      {u.initial}
                    </div>
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-semibold">
                    {u.role}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-2 text-green-600 font-medium justify-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {u.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link href={`/admin/user/${u.id}/edit`}>
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                        <FiEdit size={16} />
                      </button>
                    </Link>

                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white rounded-xl p-4 shadow border space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${u.color} text-white flex items-center justify-center font-bold`}>
                {u.initial}
              </div>
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
            </div>

            <div className="flex justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                {u.role}
              </span>
              <span className="text-green-600 font-medium">{u.status}</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/user/${u.id}/edit`} className="flex-1">
                <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                  Edit
                </button>
              </Link>

              <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
