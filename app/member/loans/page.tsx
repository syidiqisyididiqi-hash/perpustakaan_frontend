"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const loansData = [
  {
    id: 1,
    book: "Clean Code",
    borrowed: "2026-02-01",
    due: "2026-02-10",
    status: "Borrowed",
  },
  {
    id: 2,
    book: "Atomic Habits",
    borrowed: "2026-01-10",
    due: "2026-01-20",
    status: "Returned",
  },
  {
    id: 3,
    book: "Design Patterns",
    borrowed: "2026-01-25",
    due: "2026-02-05",
    status: "Late",
  },
];

export default function MyLoansPage() {
  const [query, setQuery] = useState("");

  const filtered = loansData.filter((loan) =>
    loan.book.toLowerCase().includes(query.toLowerCase())
  );

  const statusStyle = (status: string) => {
    switch (status) {
      case "Borrowed":
        return "bg-blue-100 text-blue-700";
      case "Returned":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Loans
        </h1>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Search your loans..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Book</th>
                <th className="px-6 py-4 text-left">Borrowed</th>
                <th className="px-6 py-4 text-left">Due Date</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-400"
                  >
                    No loans found
                  </td>
                </tr>
              ) : (
                filtered.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {loan.book}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {loan.borrowed}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {loan.due}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                          loan.status
                        )}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
