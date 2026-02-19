"use client";

import { useState } from "react";
import { FiSearch, FiPlus, FiCheck, FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

export default function FinePage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const fines = [
    { id: 1, user: "John Doe", book: "Clean Code", days: 3, amount: "Rp 15.000", status: "unpaid" },
    { id: 2, user: "Sarah Smith", book: "Atomic Habits", days: 1, amount: "Rp 5.000", status: "paid" },
  ];

  const filtered = fines.filter(
    (f) =>
      f.user.toLowerCase().includes(search.toLowerCase()) ||
      f.book.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Fine Management</h1>
            <p className="text-slate-300 text-sm">Manage user penalty and late return fines</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fine..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-slate-900 text-white hover:bg-slate-700"
              >
                <FiSearch />
              </button>
            </div>

            <Link href="/admin/fine/create">
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
              <th className="p-4 text-left">Book</th>
              <th className="p-4 text-center">Days Late</th>
              <th className="p-4 text-center">Amount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-semibold">{f.user}</td>
                <td className="p-4 text-slate-600">{f.book}</td>
                <td className="p-4 text-center">{f.days} Days</td>
                <td className="p-4 text-center font-medium">{f.amount}</td>

                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      f.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {f.status === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    {f.status === "unpaid" && (
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                        <FiCheck size={16} />
                      </button>
                    )}

                    <Link href={`/admin/fine/${f.id}/edit`}>
                      <button className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
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
        {filtered.map((f) => (
          <div key={f.id} className="bg-white rounded-xl p-4 shadow border space-y-3">
            <div>
              <p className="font-semibold">{f.user}</p>
              <p className="text-xs text-slate-500">{f.book}</p>
            </div>

            <div className="flex justify-between text-xs">
              <span>{f.days} Days Late</span>
              <span className="font-medium">{f.amount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  f.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {f.status === "paid" ? "Paid" : "Unpaid"}
              </span>

              <div className="flex gap-3">
                {f.status === "unpaid" && (
                  <button className="text-blue-600">
                    <FiCheck />
                  </button>
                )}

                <Link href={`/admin/fine/${f.id}/edit`}>
                  <button className="text-yellow-600">
                    <FiEdit />
                  </button>
                </Link>

                <button className="text-red-600">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
