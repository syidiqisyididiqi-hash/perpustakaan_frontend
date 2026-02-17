"use client";

import { useState } from "react";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";

export default function CategoryPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const categories = [
    { id: 1, name: "Programming", description: "Books about coding & software", total: 45 },
    { id: 2, name: "Self Development", description: "Motivation & personal growth", total: 30 },
    { id: 3, name: "History", description: "Historical books collection", total: 18 },
  ];

  const handleSearch = () => {
    setSearch(query);
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Category Management</h1>
            <p className="text-slate-300 text-sm">Manage book categories in your system</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search category..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <button
                onClick={handleSearch}
                className="px-4 bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition"
              >
                <FiSearch />
              </button>
            </div>

            <Link href="/admin/category/create">
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
              <th className="p-4 text-left">Category Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-center">Total Books</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 text-slate-500">{c.description}</td>
                <td className="p-4 text-center">{c.total}</td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <Link href={`/admin/category/${c.id}/edit`}>
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                      <FiEdit size={16} />
                    </button>
                  </Link>
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow border space-y-3">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-slate-500">{c.description}</p>
            </div>

            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">{c.total} books</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/category/${c.id}/edit`} className="flex-1">
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
