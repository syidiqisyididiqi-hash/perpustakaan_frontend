"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLoanPage() {
  const router = useRouter();

  const users = ["John Doe", "Sarah Smith", "Michael Lee"];
  const books = ["Clean Code", "Atomic Habits", "The Pragmatic Programmer"];

  const [form, setForm] = useState({
    user: "",
    book: "",
    loanDate: "",
    returnDate: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Loan created successfully!");
    router.push("/admin/loan");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg text-center">
          <h1 className="text-3xl font-bold">Create New Loan</h1>
          <p className="text-slate-300 text-sm mt-1">
            Add a new borrowing transaction
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Select User
                </label>
                <select
                  name="user"
                  value={form.user}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-800 outline-none bg-white"
                >
                  <option value="">Choose user</option>
                  {users.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Select Book
                </label>
                <select
                  name="book"
                  value={form.book}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-800 outline-none bg-white"
                >
                  <option value="">Choose book</option>
                  {books.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Loan Date
                </label>
                <input
                  type="date"
                  name="loanDate"
                  value={form.loanDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Return Date
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={form.returnDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                Save Loan
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
