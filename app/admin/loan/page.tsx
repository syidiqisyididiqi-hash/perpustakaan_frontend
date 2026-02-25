"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/loans";

type Loan = {
  id: number;
  user: string;
  loanDate: string;
  returnDate: string;
  returned: boolean;
  books: string;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return dateString.split("T")[0];
};

export default function LoanPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.status) {
        const mapped = data.data.map((l: any) => ({
          id: l.id,
          user: l.user?.name || "-",
          loanDate: formatDate(l.loan_date),
          returnDate: formatDate(l.return_date),
          returned: !!l.return_date,

          books:
            l.loan_details?.length > 0
              ? l.loan_details
                  .map(
                    (d: any) =>
                      `${d.book?.title || "-"} | Rak: ${d.rack_code} | Qty: ${d.qty}`
                  )
                  .join("\n")
              : "-",
        }));

        setLoans(mapped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const filtered = loans.filter((l) =>
    l.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data pinjaman ini?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status) fetchLoans();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Loans</h1>
            <p className="text-indigo-100 text-sm">
              Kelola pinjaman buku
            </p>
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
                className="px-4 bg-indigo-600 text-white"
              >
                <FiSearch size={16} />
              </button>
            </div>

            <Link href="/admin/loan/create">
              <button className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-105 transition">
                <FiPlus size={16} /> Tambah Pinjaman
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
                <th className="p-4 text-left">Buku Dipinjam</th>
                <th className="p-4 text-center">
                  Tanggal Peminjaman
                </th>
                <th className="p-4 text-center">
                  Tanggal Pengembalian
                </th>
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
                filtered.map((l, index) => (
                  <tr key={l.id} className="border-t hover:bg-indigo-50">
                    <td className="p-4 text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="p-4 font-semibold">{l.user}</td>

                    <td className="p-4 whitespace-pre-line">
                      {l.books}
                    </td>

                    <td className="p-4 text-center">{l.loanDate}</td>

                    <td className="p-4 text-center">{l.returnDate}</td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          l.returned
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {l.returned
                          ? "Sudah Dikembalikan"
                          : "Belum Dikembalikan"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/loan/${l.id}`}>
                          <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200">
                            <FiEye size={16} />
                          </button>
                        </Link>

                        <Link href={`/admin/loan/${l.id}/edit`}>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(l.id)}
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