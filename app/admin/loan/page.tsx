export default function LoanPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-800">
            Loan Management
          </h2>
          <p className="text-slate-500 mt-1">
            Track book loans and returns.
          </p>
        </div>

        {/* Add Loan Button */}
        <button className="bg-slate-900 text-white px-5 py-3 rounded-xl shadow hover:bg-slate-800 transition">
          + Add Loan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Book</th>
              <th className="p-4">Loan Date</th>
              <th className="p-4">Return Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">

            <tr className="border-t">
              <td className="p-4 font-medium">John Doe</td>
              <td className="p-4">Clean Code</td>
              <td className="p-4">2026-02-10</td>
              <td className="p-4">2026-02-13</td>
              <td className="p-4">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  Not Returned
                </span>
              </td>
              <td className="p-4 space-x-2">
                <button className="text-blue-600 hover:underline">Mark Returned</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">Sarah Smith</td>
              <td className="p-4">Atomic Habits</td>
              <td className="p-4">2026-02-09</td>
              <td className="p-4">2026-02-12</td>
              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Returned
                </span>
              </td>
              <td className="p-4 space-x-2">
                <button className="text-gray-400 cursor-not-allowed">Completed</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
  );
}
