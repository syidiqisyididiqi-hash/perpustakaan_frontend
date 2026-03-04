"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiBook, FiDollarSign } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const API = {
  users: "http://127.0.0.1:8000/api/users",
  categories: "http://127.0.0.1:8000/api/categories",
  books: "http://127.0.0.1:8000/api/books",
  loans: "http://127.0.0.1:8000/api/loans",
  fines: "http://127.0.0.1:8000/api/fines",
};

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    books: 0,
    loans: 0,
    fines: 0,
  });

  const [chartData, setChartData] = useState<{month:string;count:number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, categories, books, loans, fines] = await Promise.all([
          fetch(API.users).then((r) => r.json()),
          fetch(API.categories).then((r) => r.json()),
          fetch(API.books).then((r) => r.json()),
          fetch(API.loans).then((r) => r.json()),
          fetch(API.fines).then((r) => r.json()),
        ]);

        setStats({
          users: users.data.length,
          categories: categories.data.length,
          books: books.data.length,
          loans: loans.data.length,
          fines: fines.data.length,
        });

        const countByMonth: Record<string, number> = {};
        loans.data.forEach((l: any) => {
          const d = new Date(l.loan_date);
          const key = d.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          countByMonth[key] = (countByMonth[key] || 0) + 1;
        });
        const chart = Object.entries(countByMonth).map(([month, count]) => ({
          month,
          count,
        }));
        setChartData(chart);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 space-y-10">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Welcome back, Admin 👋
          </p>
        </div>

        <div className="bg-white shadow rounded-xl px-6 py-3 border">
          <p className="text-sm text-slate-500">System Status</p>
          <p className="text-green-600 font-semibold">
            ● All Systems Operational
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<FiUsers />}
          loading={loading}
          color="from-blue-500 to-indigo-500"
        />

        <StatCard
          title="Books"
          value={stats.books}
          icon={<FiBook />}
          loading={loading}
          color="from-purple-500 to-pink-500"
        />

        <StatCard
          title="Active Loans"
          value={stats.loans}
          icon={<FiBook />}
          loading={loading}
          color="from-emerald-500 to-teal-500"
        />

        <StatCard
          title="Total Fines"
          value={stats.fines}
          icon={<FiDollarSign />}
          loading={loading}
          color="from-orange-500 to-red-500"
        />

      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Peminjaman per Bulan</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-3xl p-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-2xl">
        <p className="opacity-80 text-sm">Library Summary</p>

        <h3 className="text-4xl font-bold mt-3">
          Everything Running Smoothly 🚀
        </h3>

        <p className="opacity-80 mt-3 max-w-xl">
          No issues detected. Your library system is performing
          optimally with stable loan activity and healthy user engagement.
        </p>
      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  loading,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
}) {
  return (
    <div className="relative group rounded-3xl overflow-hidden shadow-lg border bg-white p-7 transition hover:scale-[1.03]">
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${color} transition`}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>

          {loading ? (
            <div className="h-8 w-20 bg-slate-200 animate-pulse rounded mt-3" />
          ) : (
            <h3 className="text-4xl font-bold text-slate-900 mt-2">
              {value}
            </h3>
          )}
        </div>

        <div
          className={`p-4 rounded-2xl text-white bg-gradient-to-br ${color} shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}