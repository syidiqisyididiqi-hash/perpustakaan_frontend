"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiBook, FiDollarSign, FiLayers } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Alert } from "@/app/lib/alert";

const API = {
  users: "http://127.0.0.1:8000/api/users",
  categories: "http://127.0.0.1:8000/api/categories",
  books: "http://127.0.0.1:8000/api/books",
  loans: "http://127.0.0.1:8000/api/loans",
  fines: "http://127.0.0.1:8000/api/fines",
};

export default function AdminPage() {
  const [stats, setStats] = useState({
    admins: 0,
    members: 0,
    books: 0,
    categories: 0,
    loans: 0,
    activeLoans: 0,
    fines: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Alert.error("Unauthorized");
      setLoading(false);
      return;
    }

    const fetchWithAuth = async (url: string) => {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    };

    const fetchData = async () => {
      try {
        const [users, categories, books, loans, fines] = await Promise.all([
          fetchWithAuth(API.users),
          fetchWithAuth(API.categories),
          fetchWithAuth(API.books),
          fetchWithAuth(API.loans),
          fetchWithAuth(API.fines),
        ]);

        const userList = users.data || [];
        const loanList = loans.data || [];
        const fineList = fines.data || [];

        const admins = userList.filter((u: any) =>
          u.role?.toLowerCase() === "admin" || u.is_admin === true
        ).length;

        const members = userList.length - admins;

        const returnedLoans = loanList.filter((l: any) =>
          l.status?.toLowerCase() === "returned" || l.returned_at
        ).length;

        const activeLoans = loanList.length - returnedLoans;

        const paidFines = fineList.filter((f: any) =>
          f.is_paid || f.status?.toLowerCase() === "paid"
        ).length;

        const unpaidFines = fineList.length - paidFines;

        setStats({
          admins,
          members,
          books: books.data?.length || 0,
          categories: categories.data?.length || 0,
          loans: loanList.length,
          activeLoans,
          fines: fineList.length,
        });

        setChartData([
          { label: "Admin", value: admins },
          { label: "Member", value: members },
          { label: "Buku", value: books.data?.length || 0 },
          { label: "Dipinjam", value: activeLoans },
          { label: "Kembali", value: returnedLoans },
          { label: "Denda Belum", value: unpaidFines },
          { label: "Denda Lunas", value: paidFines },
        ]);

        setRecentLoans(loanList.slice(0, 5));
      } catch (err) {
        Alert.error("Gagal ambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard Perpustakaan</h1>
          <p className="text-slate-500">Monitoring sistem perpustakaan</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow text-green-600">
          ● System Normal
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Stat title="Admin" value={stats.admins} icon={<FiUsers />} />
        <Stat title="Member" value={stats.members} icon={<FiUsers />} />
        <Stat title="Buku" value={stats.books} icon={<FiBook />} />
        <Stat title="Kategori" value={stats.categories} icon={<FiLayers />} />
        <Stat title="Pinjaman" value={stats.loans} icon={<FiBook />} />
        <Stat title="Denda" value={stats.fines} icon={<FiDollarSign />} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Statistik</h2>
        {loading ? (
          <div className="h-60 bg-slate-200 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Box title="Pinjaman Aktif" value={stats.activeLoans} color="text-blue-600" />
        <Box title="Sudah Kembali" value={chartData.find(d=>d.label==='Kembali')?.value||0} color="text-green-600" />
        <Box title="Denda Belum Bayar" value={chartData.find(d=>d.label==='Denda Belum')?.value||0} color="text-red-600" />
      </div>

    </div>
  );
}

function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
      <div className="text-xl">{icon}</div>
    </div>
  );
}

function Box({ title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}
