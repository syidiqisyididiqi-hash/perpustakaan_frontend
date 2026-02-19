export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 space-y-10">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Admin 👋</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="w-10 h-10 rounded-full bg-slate-300"></div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="rounded-2xl p-6 bg-white shadow-lg border">
            <p className="text-sm text-slate-500">Total Users</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">1,245</h3>
            <p className="text-xs text-green-600 mt-1">+12% this month</p>
          </div>

          <div className="rounded-2xl p-6 bg-white shadow-lg border">
            <p className="text-sm text-slate-500">Total Books</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">3,842</h3>
            <p className="text-xs text-green-600 mt-1">Library stock</p>
          </div>

          <div className="rounded-2xl p-6 bg-white shadow-lg border">
            <p className="text-sm text-slate-500">Active Loans</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">128</h3>
            <p className="text-xs text-yellow-600 mt-1">Currently borrowed</p>
          </div>

          <div className="rounded-2xl p-6 bg-white shadow-lg border">
            <p className="text-sm text-slate-500">Late Returns</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">12</h3>
            <p className="text-xs text-red-600 mt-1">Need attention</p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="rounded-2xl p-6 bg-white shadow-lg border">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Loan Progress
          </h3>

          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full border-[14px] border-blue-600 border-t-slate-200 border-r-slate-200 border-b-slate-200"></div>
            <p className="mt-6 text-3xl font-bold text-slate-900">72%</p>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl p-6 bg-white shadow-lg border">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Weekly Activity
          </h3>

          <div className="flex items-end justify-between h-56">
            <div className="w-10 bg-blue-600 rounded-t-xl h-20"></div>
            <div className="w-10 bg-blue-600 rounded-t-xl h-36"></div>
            <div className="w-10 bg-blue-600 rounded-t-xl h-28"></div>
            <div className="w-10 bg-blue-600 rounded-t-xl h-44"></div>
            <div className="w-10 bg-blue-600 rounded-t-xl h-32"></div>
            <div className="w-10 bg-blue-600 rounded-t-xl h-24"></div>
          </div>
        </div>

      </div>

      <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <p className="text-sm opacity-80">System Summary</p>
        <h3 className="text-3xl font-bold mt-2">All Systems Running Smoothly</h3>
        <p className="text-sm mt-2 opacity-80">
          No issues detected in the last 24 hours
        </p>
      </div>

    </div>
  );
}
