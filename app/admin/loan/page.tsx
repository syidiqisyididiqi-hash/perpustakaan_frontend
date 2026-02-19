"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiPlus, FiTrash2, FiCheck, FiEye, FiX, FiEdit } from "react-icons/fi";

export default function LoanPage() {
  const [query, setQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [editingLoan, setEditingLoan] = useState<any>(null);

  const [loans, setLoans] = useState([
    {
      id: 1,
      user: "John Doe",
      book: "Clean Code",
      loanDate: "2026-02-10",
      returnDate: "2026-02-13",
      returned: false,
    },
    {
      id: 2,
      user: "Sarah Smith",
      book: "Atomic Habits",
      loanDate: "2026-02-09",
      returnDate: "2026-02-12",
      returned: true,
    },
  ]);

  const filtered = loans.filter(
    (l) =>
      l.user.toLowerCase().includes(query.toLowerCase()) ||
      l.book.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Delete this loan?")) {
      setLoans(loans.filter((l) => l.id !== id));
    }
  };

  const handleReturn = (id: number) => {
    setLoans(loans.map((l) => (l.id === id ? { ...l, returned: true } : l)));
  };

  const handleEditChange = (e: any) => {
    setEditingLoan({
      ...editingLoan,
      [e.target.name]: e.target.value,
    });
  };

  const saveEdit = () => {
    setLoans(loans.map((l) => (l.id === editingLoan.id ? editingLoan : l)));
    setEditingLoan(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Loan Management</h1>
            <p className="text-slate-300 text-sm">Track book loans and returns</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search loan..."
                className="flex-1 px-4 py-2 text-sm outline-none text-slate-800"
              />
              <div className="px-4 bg-slate-900 text-white flex items-center">
                <FiSearch />
              </div>
            </div>

            <Link href="/admin/loan/create">
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
              <th className="p-4 text-left">Loan Date</th>
              <th className="p-4 text-left">Return Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-semibold">{l.user}</td>
                <td className="p-4">{l.book}</td>
                <td className="p-4">{l.loanDate}</td>
                <td className="p-4">{l.returnDate}</td>
                <td className="p-4 text-center">
                  {l.returned ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      Returned
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      Not Returned
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedLoan(l)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                    >
                      <FiEye size={16} />
                    </button>

                    <button
                      onClick={() => setEditingLoan(l)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <FiEdit size={16} />
                    </button>

                    {!l.returned && (
                      <button
                        onClick={() => handleReturn(l.id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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

      {editingLoan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Loan</h2>
              <button onClick={() => setEditingLoan(null)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                name="user"
                value={editingLoan.user}
                onChange={handleEditChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                name="book"
                value={editingLoan.book}
                onChange={handleEditChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                type="date"
                name="loanDate"
                value={editingLoan.loanDate}
                onChange={handleEditChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                type="date"
                name="returnDate"
                value={editingLoan.returnDate}
                onChange={handleEditChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <button
              onClick={saveEdit}
              className="w-full py-3 bg-slate-900 text-white rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
