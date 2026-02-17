"use client";

import { useState } from "react";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";

export default function BookPage() {
  const [query, setQuery] = useState("");

  const books = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", stock: 12, status: "Available", color: "from-green-400 to-green-600", initial: "C" },
    { id: 2, title: "Atomic Habits", author: "James Clear", category: "Self Development", stock: 0, status: "Out of Stock", color: "from-red-400 to-red-600", initial: "A" },
  ];

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure want to delete this book?")) {
      console.log("Delete book id:", id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Book Management</h1>
            <p className="text-slate-300 text-sm">Manage all books in your library system.</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search book..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <button className="px-4 bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition">
                <FiSearch />
              </button>
            </div>

            <Link href="/admin/book/create">
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
              <th className="p-4 text-left">Book</th>
              <th className="p-4 text-center">Category</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${b.color} text-white flex items-center justify-center font-bold`}>
                      {b.initial}
                    </div>
                    <div>
                      <p className="font-semibold">{b.title}</p>
                      <p className="text-xs text-slate-500">{b.author}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-center">{b.category}</td>
                <td className="p-4 text-center">{b.stock}</td>

                <td className="p-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {b.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link href={`/admin/book/${b.id}/edit`}>
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                        <FiEdit size={16} />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
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
        {filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-xl p-4 shadow border space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${b.color} text-white flex items-center justify-center font-bold`}>
                {b.initial}
              </div>
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-xs text-slate-500">{b.author}</p>
              </div>
            </div>

            <div className="flex justify-between text-xs">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {b.category}
              </span>
              <span className={`${b.status === "Available" ? "text-green-600" : "text-red-600"} font-medium`}>
                {b.status}
              </span>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/book/${b.id}/edit`} className="flex-1">
                <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => handleDelete(b.id)}
                className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
