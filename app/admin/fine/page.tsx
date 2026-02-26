"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/fines";

type Fine = {
  id: number;
  user: string;
  rackCode: string;
  overdueDays: number;
  totalFine: number;
  status: string;
};

export default function FinePage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.status) {
        const mapped = data.data.map((f: any) => ({
          id: f.id,
          user: f.loan?.user?.name || "-",
          rackCode: f.rack_code,
          overdueDays: f.overdue_days,
          totalFine: f.total_fine,
          status: f.status,
        }));

        setFines(mapped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const filtered = fines.filter((f) =>
    f.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data denda ini?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status) fetchFines();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fines</h1>
            <p className="text-red-100 text-sm">Kelola denda keterlambatan</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full sm:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari user..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-red-600 text-white"
              >
                <FiSearch size={16} />
              </button>
            </div>

            <Link href="/admin/fine/create">
              <button className="flex items-center gap-2 bg-white text-red-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-105 transition">
                <FiPlus size={16} /> Tambah Denda
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4 text-center">No</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-center">Rack</th>
                <th className="p-4 text-center">Hari Telat</th>
                <th className="p-4 text-center">Total Denda</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((f, index) => (
                  <tr key={f.id} className="border-t hover:bg-red-50">
                    <td className="p-4 text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="p-4 font-semibold">{f.user}</td>

                    <td className="p-4 text-center">{f.rackCode}</td>

                    <td className="p-4 text-center">
                      {f.overdueDays} Hari
                    </td>

                    <td className="p-4 text-center font-semibold text-red-600">
                      Rp {f.totalFine.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          f.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {f.status === "paid" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/fine/${f.id}`}>
                          <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200">
                            <FiEye size={16} />
                          </button>
                        </Link>

                        <Link href={`/admin/fine/${f.id}/edit`}>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}