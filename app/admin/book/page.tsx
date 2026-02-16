export default function BookPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-800">
            Book Management
          </h2>
          <p className="text-slate-500 mt-1">
            Manage all books in your library system.
          </p>
        </div>

        <button className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition">
          + Add Book
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">

            <tr className="border-t">
              <td className="p-4 font-medium">Clean Code</td>
              <td className="p-4">Robert C. Martin</td>
              <td className="p-4">Programming</td>
              <td className="p-4">12</td>
              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Available
                </span>
              </td>
              <td className="p-4 space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">Atomic Habits</td>
              <td className="p-4">James Clear</td>
              <td className="p-4">Self Development</td>
              <td className="p-4">0</td>
              <td className="p-4">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                  Out of Stock
                </span>
              </td>
              <td className="p-4 space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
  );
}
