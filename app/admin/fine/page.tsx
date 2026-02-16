export default function FinePage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-800">
            Fine Management
          </h2>
          <p className="text-slate-500 mt-1">
            Manage user penalty and late return fines.
          </p>
        </div>

        {/* BUTTON ADD */}
        <button className="bg-slate-900 text-white px-5 py-3 rounded-xl shadow hover:bg-slate-800 transition">
          + Add Fine
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Book</th>
              <th className="p-4">Days Late</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">

            <tr className="border-t">
              <td className="p-4 font-medium">John Doe</td>
              <td className="p-4">Clean Code</td>
              <td className="p-4">3 Days</td>
              <td className="p-4">Rp 15.000</td>
              <td className="p-4">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                  Unpaid
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">
                  Mark Paid
                </button>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">Sarah Smith</td>
              <td className="p-4">Atomic Habits</td>
              <td className="p-4">1 Day</td>
              <td className="p-4">Rp 5.000</td>
              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Paid
                </span>
              </td>
              <td className="p-4">
                <button className="text-gray-400 cursor-not-allowed">
                  Completed
                </button>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
  );
}
