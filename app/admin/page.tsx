export default function AdminPage() {
  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Back, Admin 👋
        </h2>
        <p className="text-slate-500 mt-1">
          Here’s a quick overview of your system today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 - Total Users */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-lg p-6 flex items-center gap-6 text-white">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 36 36">
              <path
                className="text-blue-300"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
              <path
                className="text-white"
                strokeDasharray="80,100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              1.25k
            </div>
          </div>
          <div>
            <p className="text-sm opacity-80">Total Users</p>
            <p className="mt-2 text-lg font-semibold">Active Now</p>
          </div>
        </div>

        {/* Card 2 - Products */}
        <div className="bg-gradient-to-r from-green-500 to-green-300 rounded-2xl shadow-lg p-6 flex items-center gap-6 text-white">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 36 36">
              <path
                className="text-green-200"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
              <path
                className="text-white"
                strokeDasharray="64,100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              320
            </div>
          </div>
          <div>
            <p className="text-sm opacity-80">Products</p>
            <p className="mt-2 text-lg font-semibold">In Stock</p>
          </div>
        </div>

        {/* Card 3 - Orders Today */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-2xl shadow-lg p-6 flex items-center gap-6 text-slate-900">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 36 36">
              <path
                className="text-yellow-300"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
              <path
                className="text-yellow-700"
                strokeDasharray="89,100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              89
            </div>
          </div>
          <div>
            <p className="text-sm opacity-80">Orders Today</p>
            <p className="mt-2 text-lg font-semibold">Pending</p>
          </div>
        </div>

      </div>

      {/* Mini Bar Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Weekly Orders Trend
        </h3>
        <div className="flex items-end gap-2 h-32">
          <div className="w-8 bg-blue-600 rounded-t-xl h-16"></div>
          <div className="w-8 bg-blue-600 rounded-t-xl h-20"></div>
          <div className="w-8 bg-blue-600 rounded-t-xl h-24"></div>
          <div className="w-8 bg-blue-600 rounded-t-xl h-14"></div>
          <div className="w-8 bg-blue-600 rounded-t-xl h-28"></div>
          <div className="w-8 bg-blue-600 rounded-t-xl h-18"></div>
          <div className="w-8 bg-blue-600 rounded-t-xl h-22"></div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Activity
        </h3>
        <ul className="space-y-3 text-slate-600">
          <li>✅ New user registered</li>
          <li>📦 Product updated</li>
          <li>🛒 New order placed</li>
          <li>⚙️ System settings changed</li>
        </ul>
      </div>

    </div>
  );
}
