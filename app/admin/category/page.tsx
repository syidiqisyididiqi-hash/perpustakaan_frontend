export default function CategoryPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-800">
            Category Management
          </h2>
          <p className="text-slate-500 mt-1">
            Manage book categories in your system.
          </p>
        </div>

        <button className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition">
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="p-4">Category Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Total Books</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">

            <tr className="border-t">
              <td className="p-4 font-medium">Programming</td>
              <td className="p-4">Books about coding & software</td>
              <td className="p-4">45</td>
              <td className="p-4 space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">Self Development</td>
              <td className="p-4">Motivation & personal growth</td>
              <td className="p-4">30</td>
              <td className="p-4 space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">History</td>
              <td className="p-4">Historical books collection</td>
              <td className="p-4">18</td>
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
