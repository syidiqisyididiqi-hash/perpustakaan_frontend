"use client";

import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function UserPage() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@mail.com",
      role: "Admin",
      status: "Active",
      initial: "J",
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@mail.com",
      role: "User",
      status: "Pending",
      initial: "S",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Users Management
            </h1>
            <p className="text-slate-300 mt-1 text-sm md:text-base">
              Manage your system users easily
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder:text-slate-300 focus:outline-none"
              />
            </div>

            {/* ADD USER */}
            <Link href="/admin/user/create">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold hover:bg-slate-100 transition">
                <FiPlus />
                Add User
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-3xl shadow-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
            <tr>
              <th className="p-6">User</th>
              <th className="p-6">Role</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50 group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${u.color} text-white flex items-center justify-center font-bold`}
                    >
                      {u.initial}
                    </div>

                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <span className="px-4 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-semibold">
                    {u.role}
                  </span>
                </td>

                <td className="p-6">
                  <div className="flex items-center gap-2 font-medium text-green-600">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                    {u.status}
                  </div>
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                    
                    {/* EDIT */}
                    <Link href={`/admin/users/${u.id}/edit`}>
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <FiEdit />
                      </button>
                    </Link>

                    {/* DELETE */}
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl p-5 shadow border space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${u.color} text-white flex items-center justify-center font-bold`}
              >
                {u.initial}
              </div>

              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                {u.role}
              </span>

              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                {u.status}
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/admin/user/${u.id}/edit`} className="flex-1">
                <button className="w-full py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold">
                  Edit
                </button>
              </Link>

              <button className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 font-semibold">
                Delete
              </button>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
